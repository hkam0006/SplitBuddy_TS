import { Navigate } from "react-router-dom";
import useStore from "../../store";

type PublicRouteProps = {
  Component: React.FC
}

const PublicRoute = ({ Component }: PublicRouteProps): JSX.Element => {
  const { isLogin } = useStore()
  return (
    isLogin ? <Navigate to='/dashboard' replace /> : <Component />
  )
}

export default PublicRoute