const LoginPage = () => {
  return (
    <>
        <h1>Sign In</h1>
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
        <button>Sign In</button>
        <label htmlFor="remember-me">Remember me</label>
        <input type="checkbox" id="remember-me" />
        <a href="#">Forgot password?</a>
    </>
  )
}

export default LoginPage