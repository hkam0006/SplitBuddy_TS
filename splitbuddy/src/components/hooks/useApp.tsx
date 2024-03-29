import { collection, doc, setDoc, query, where, orderBy, getDoc, onSnapshot, Timestamp, Unsubscribe, updateDoc, arrayUnion, arrayRemove, deleteDoc } from "firebase/firestore"
import useStore from "../../store"
import { auth, db } from "../../firebase"
import { getAuth } from "firebase/auth"

export type CurrencyType = "USD" | "AUD" | "EUR" | "YEN" | "WON" | "HKD"

export type GroupObject = {
  name: string,
  id: string,
  owner: string,
  currency: CurrencyType
  members: string[],
  createdAt: string,
  history: ExpenseType[],
  transactions: ExpenseType[]
}

export type InviteProps = {
  senderEmail: string,
  senderId: string,
  groupName: string
  groupId: string
}

export type ExpenseType = {
  id: string,
  label: string,
  amount: number,
  date: Timestamp,
  debtor: string,
  debtee: string
}

type SplitUser = {
  id: string,
  invites: InviteProps[]
}

const useApp = () => {
  const { loader, groups, setGroups, setInvites, setToaster } = useStore()
  const { currentUser } = getAuth()

  async function createUserDoc(uid: string, email: string) {
    const userDocRef = doc(db, `/users/${email}/`)
    try {
      const newUserDoc: SplitUser = {
        id: uid,
        invites: []
      }
      await setDoc(userDocRef, newUserDoc)
    } catch (err) {
      console.log(err)
    }
  }

  async function deleteGroup(groupId: string) {
    if (!groupId) {
      setToaster("Error deleting group", "error")
      return false
    }
    try {
      const groupDocRef = doc(db, `/groups/${groupId}`)
      await deleteDoc(groupDocRef)
      setToaster("Group deleted successfully", "success")
      return true
    } catch (err) {
      console.log(err)
    }
    setToaster("Error deleting group", "error")
    return false
  }

  async function findUser(email: string) {
    const userDocRef = doc(db, `users/${email}`)
    try {
      const doc = await getDoc(userDocRef)
      if (doc.exists()) {
        return true
      } else {
        return false
      }
    } catch (err) {
      console.log(err)
      return false
    }
  }

  async function declineInvite(inviteToDecline: InviteProps) {
    if (!currentUser) return
    const docRef = doc(db, `users/${currentUser.email}`)
    try {
      await updateDoc(docRef, {
        invites: arrayRemove(inviteToDecline)
      })
    } catch (err) {
      console.log(err)
    }
  }

  async function acceptInvite(inviteToAccept: InviteProps) {
    if (!currentUser) return
    const docRef = doc(db, `users/${currentUser.email}`)
    try {
      await updateDoc(docRef, {
        invites: arrayRemove(inviteToAccept)
      })
      await updateDoc(doc(db, `groups/${inviteToAccept.groupId}`), {
        members: arrayUnion(currentUser.uid)
      })
      setToaster(`Invite to "${inviteToAccept.groupName}" accepted!`, "success")
    } catch (err) {
      console.log(err)
      setToaster("Error accepting invite", "error")
    }
  }

  async function sendInvite(email: string, groupName: string, groupId: string) {
    const docRef = doc(db, `users/${email}`)
    if (!currentUser) return
    try {
      await updateDoc(docRef, {
        invites: arrayUnion({
          senderEmail: currentUser.email,
          senderId: currentUser.uid,
          groupName: groupName,
          groupId: groupId
        })
      })
    } catch (err) {
      console.log(err)
      setToaster(`Error sending invite`, "error")
    }
  }

  async function sendInvites(inviteList: string[], groupName: string, groupId: string) {
    const promises: Promise<any>[] = []
    try {
      for (let i = 0; i < inviteList.length; i++) {
        promises.push(sendInvite(inviteList[i], groupName, groupId))
      }
      await Promise.all(promises)
      setToaster(`Invites sent!`, "success")
    } catch (err) {
      console.log(err)
      setToaster(`Error sending invites`, "error")
    }
  }

  async function createGroup(name: string, currency: CurrencyType) {
    const groupId = crypto.randomUUID()
    const groupsCollectionRef = doc(db, `/groups/${groupId}`)
    if (!currentUser) {
      return
    }
    try {
      const newExpenseGroup = {
        name: name,
        id: groupId,
        owner: currentUser.uid,
        currency: currency,
        members: [currentUser.uid],
        createdAt: Timestamp.now(),
        history: [],
        transactions: []
      }
      await setDoc(groupsCollectionRef, newExpenseGroup)
      setToaster(`Group created (${groupId})`, "success")
    } catch (err) {
      setToaster(`Error creating group!. Try again later`, "error")
      console.log(err)
    }
  }

  async function splitExpense(group: GroupObject, amount: number, label: string) {
    if (!currentUser) return
    const splitBy = group.members.length
    const debted = Number((amount / splitBy).toFixed(2))
    const membersCopy = group.members.filter(member => member != currentUser.uid)
    const newTransactions = []
    for (let i = 0; i < membersCopy.length; i++) {
      const newId = crypto.randomUUID()
      newTransactions.push({
        id: newId,
        label: label,
        amount: debted,
        date: Timestamp.now(),
        debtor: membersCopy[i],
        debtee: currentUser.uid
      })
    }
    try {
      await updateDoc(doc(db, `groups/${group.id}`), {
        transactions: [...newTransactions, ...group.transactions]
      })
      setToaster(`New Expense added!`, "success")
    } catch (err) {
      console.log(err)
      setToaster(`Had trouble adding expense. Try again later!`, "error")
    }
  }

  async function fetchInvites(setLoading: React.Dispatch<React.SetStateAction<boolean>>) {
    if (!currentUser) return
    const documentRef = doc(db, `/users/${currentUser.email}`)
    try {
      const unsub = onSnapshot(documentRef, (doc) => {
        const userInfo = doc.data() as SplitUser
        setInvites(userInfo.invites)
      })
      setLoading(false)
      return unsub
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  async function fetchSingleGroup(
    groupId: string,
    setGroup: React.Dispatch<React.SetStateAction<GroupObject | undefined>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setSettled: React.Dispatch<React.SetStateAction<ExpenseType[]>>,
    setUnsettled: React.Dispatch<React.SetStateAction<ExpenseType[]>>) {
    if (!currentUser) return
    const documentRef = doc(db, `groups/${groupId}`)
    try {
      const unsub = onSnapshot(documentRef, (doc) => {
        if (doc.exists()) {
          const updatedDoc = {
            ...doc.data(),
          }
          const finalDoc = updatedDoc as GroupObject
          setGroup(finalDoc)
          setSettled(finalDoc.history.filter((trn) => trn.debtee == currentUser.uid || trn.debtor == currentUser.uid))
          setUnsettled(finalDoc.transactions.filter((trn) => trn.debtee == currentUser.uid || trn.debtor == currentUser.uid))
          setLoading(false)
        } else {
          setGroup(undefined)
        }
      })
      return unsub
    } catch (err) {
      console.log(err)
    }
  }

  async function deleteExpense(expense: ExpenseType, groupId: string) {
    try {
      const docRef = doc(db, `/groups/${groupId}`)
      await updateDoc(docRef, {
        transactions: arrayRemove(expense)
      })
      setToaster(`Expense deleted`, "success")
    } catch (err) {
      console.log(err)
      setToaster(`Having trouble deleting expense`, "error")
    }
  }

  async function settleUp(group: GroupObject, settledExpenses: ExpenseType[]) {
    const idArray: string[] = []
    for (let i = 0; i < settledExpenses.length; i++) {
      idArray.push(settledExpenses[i].id)
    }
    const remainingTransactions = group.transactions.filter((t) => !idArray.includes(t.id))
    const leftOver = group.transactions.filter((t) => idArray.includes(t.id))
    try {
      await updateDoc(doc(db, `groups/${group.id}`), {
        transactions: remainingTransactions,
        history: [...leftOver, ...group.history]
      })
      setToaster(`Expenses Settled!`, "success")
    } catch (err) {
      console.log(err)
      setToaster(`Having trouble settling expenses. Try again later`, "success")
    }
  }

  async function fetchGroups(
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setFilteredBoards: React.Dispatch<React.SetStateAction<GroupObject[]>>): Promise<Unsubscribe | undefined> {
    if (!currentUser) return
    const groupsCollectionRef = collection(db, '/groups/')
    try {
      const q = query(groupsCollectionRef, where("members", "array-contains", `${currentUser.uid}`), orderBy("createdAt", "desc"))
      const unsub: Unsubscribe = onSnapshot(q, (querySnapshot) => {
        const groups = [] as GroupObject[]
        querySnapshot.forEach((doc) => {
          const updatedDoc = {
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate().toLocaleString('en-UK')
          }
          const docData = updatedDoc as GroupObject
          groups.push(docData)
        })
        setGroups(groups)
        setFilteredBoards(groups)
      })
      setLoading(false)
      return unsub
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  async function leaveGroup(groupId: string) {
    if (!auth.currentUser) {
      return
    }
    const docRef = doc(db, `/groups/${groupId}`)
    try {
      await updateDoc(docRef, {
        members: arrayRemove(auth.currentUser.uid)
      })
      setToaster("You have left the group", "success")
      return true
    } catch (err) {
      console.log(err)
      setToaster("Error leaving group", "error")
    }
    return false
  }

  async function updateTransactions(groupId: string, newTransactions: ExpenseType[]) {
    if (!auth.currentUser) {
      return
    }

    const docRef = doc(db, `/groups/${groupId}`)

    try {
      await updateDoc(docRef, {
        transactions: newTransactions
      })
      setToaster("Changes applied", "success")
    } catch (err) {
      setToaster("Error occured trying to update transactions", "error")
      console.log(err)
    }
  }

  return {
    createUserDoc,
    createGroup,
    fetchGroups,
    fetchInvites,
    fetchSingleGroup,
    findUser,
    sendInvites,
    acceptInvite,
    declineInvite,
    splitExpense,
    settleUp,
    deleteGroup,
    deleteExpense,
    leaveGroup,
    updateTransactions
  }
}

export default useApp