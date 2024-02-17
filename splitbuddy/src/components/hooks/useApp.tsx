import { addDoc, collection, doc, setDoc, query, where, orderBy, getDoc, getDocs, onSnapshot, Timestamp, Unsubscribe, updateDoc, arrayUnion, arrayRemove, FieldValue } from "firebase/firestore"
import useStore from "../../store"
import { db } from "../../firebase"
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
  const { loader, groups, setGroups, setInvites } = useStore()
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
    } catch (err) {
      console.log(err)
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
    }
  }

  async function sendInvites(inviteList: string[], groupName: string, groupId: string) {
    const promises: Promise<any>[] = []
    try {
      for (let i = 0; i < inviteList.length; i++) {
        promises.push(sendInvite(inviteList[i], groupName, groupId))
      }
      await Promise.all(promises)
    } catch (err) {
      console.log(err)
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

    } catch (err) {
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
      newTransactions.push({
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
    } catch (err) {
      console.log(err)
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
        }
      })
      return unsub
    } catch (err) {
      console.log(err)
    }
  }

  async function settleUp(group: GroupObject) {
    try {
      await updateDoc(doc(db, `groups/${group.id}`), {
        transactions: [],
        history: [...group.transactions, ...group.history]
      })
    } catch (err) {
      console.log(err)
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
    settleUp
  }
}

export default useApp