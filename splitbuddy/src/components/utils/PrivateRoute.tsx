import { Navigate } from "react-router-dom";

import useStore from "../../store";

type PrivateRouteProps = {
  Component: React.FC
}

const PrivateRoute = ({ Component }: PrivateRouteProps): JSX.Element => {
  const { isLogin } = useStore()
  return (
    isLogin ? <Component /> : <Navigate to='/' replace />
  )
}
export default PrivateRoute