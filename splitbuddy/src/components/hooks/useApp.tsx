import { addDoc, collection, doc, setDoc, updateDoc, serverTimestamp, FieldValue, query, where, orderBy, getDoc, getDocs, onSnapshot, Timestamp, Unsubscribe } from "firebase/firestore"
import useStore from "../../store"
import { db } from "../../firebase"
import { getAuth } from "firebase/auth"
import { StringMappingType } from "typescript"

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
  senderId: string
}

export type ExpenseType = {
  label: string,
  amount: number,
  date: string,
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
    setLoading: React.Dispatch<React.SetStateAction<boolean>>) {
    if (!currentUser) return
    const documentRef = doc(db, `groups/${groupId}`)
    try {
      const unsub = onSnapshot(documentRef, (doc) => {
        if (doc.exists()) {
          const updatedDoc = {
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate().toLocaleString('en-UK')
          }
          const finalDoc = updatedDoc as GroupObject
          setGroup(finalDoc)
          setLoading(false)
        }
      })
      return unsub
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
    fetchSingleGroup
  }
}

export default useApp