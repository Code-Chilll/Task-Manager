export default function Signup() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <div>
          <h1 className="text-center">Sign Up</h1>
          <p className="text-center">
            Create your Task Manager account
          </p>
        </div>
        
        <form>
          <div>
            <div>
              <label htmlFor="name" className="block">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="block w-full"
                placeholder="Enter your full name"
              />
            </div>
            
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

          <div>
            <button
              type="submit"
              className="w-full flex justify-center"
            >
              Sign Up
            </button>
          </div>
          
          <div className="text-center">
            <a href="/login">
              Already have an account? Sign in
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
