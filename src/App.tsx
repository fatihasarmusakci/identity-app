import IdentityForm from './components/IdentityForm'
import AnimatedBackground from './components/AnimatedBackground'
import ThemeSwitcher from './components/ThemeSwitcher'
import './index.css'

export default function App() {
  return (
    <>
      <AnimatedBackground />
      <ThemeSwitcher />
      <IdentityForm />
    </>
  )
}
