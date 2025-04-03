import { useAuthStore } from "../store/useAuthStore"

export default function Navbar() {
  const {authUser} = useAuthStore()
  return (
    <div>Navbar</div>
  )
}
