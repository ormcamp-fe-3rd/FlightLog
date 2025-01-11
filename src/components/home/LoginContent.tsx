import useLoginModalStore from "@/store/useLoginModal";

export default function LoginContent() {
  const { toggle } = useLoginModalStore();
  return (
    <>
      <div className="flex justify-between">
        <h2 className="mb-2 text-2xl font-bold text-black">Login</h2>
        <button className="btn btn-circle btn-ghost" onClick={toggle}>
          ✖️
        </button>
      </div>
      <form className="text-black">
        <label htmlFor="email" className="label">
          <span className="label-text">e-mail</span>
        </label>
        <input
          type="email"
          id="email"
          className="input input-sm input-bordered w-full focus:border-blue-500 focus:outline-none"
          required
        />

        <div className="mb-8">
          <label htmlFor="password" className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            id="password"
            className="input input-sm input-bordered w-full"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-full">
          Login
        </button>
      </form>
    </>
  );
}
