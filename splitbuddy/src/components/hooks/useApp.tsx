import useStore from "../../store"

export type GroupObject = {
  name: string,
  id: string,
  owner: string
}

const useApp = () => {
  const { loader } = useStore()

  async function createGroup() {
    try {

    } catch (err) {

    }
  }

  return {
    createGroup
  }
}

export default useApp