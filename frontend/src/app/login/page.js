export default function Login() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <div>
          <h1 className="text-center">Sign In</h1>
          <p className="text-center">
            Sign in to your Task Manager account
          </p>
        </div>
        
        <form>
          <div>
            <div>
              <label htmlFor="email" className="block">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="block w-full"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block w-full"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
              />
              <label htmlFor="remember-me">
                Remember me
              </label>
            </div>

            <div>
              <a href="#">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center"
            >
              Sign In
            </button>
          </div>
          
          <div className="text-center">
            <a href="/signup">
              Don't have an account? Sign up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
