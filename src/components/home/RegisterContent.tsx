import useLoginModalStore from "@/store/useLoginModal";

export default function RegisterContent() {
  const { toggle } = useLoginModalStore();
  return (
    <>
      <div className="flex justify-between">
        <h2 className="mb-4 text-2xl font-bold text-black">Register</h2>
        <button className="btn btn-circle btn-ghost" onClick={toggle}>
          ✖️
        </button>
      </div>
      <form className="text-black">
        <label htmlFor="name" className="label">
          <span className="label-text">name</span>
        </label>
        <input
          type="text"
          id="name"
          className="input input-sm input-bordered w-full focus:border-blue-500 focus:outline-none"
          required
        />

        <label htmlFor="email" className="label">
          <span className="label-text">e-mail</span>
        </label>
        <input
          type="email"
          id="email"
          className="input input-sm input-bordered w-full focus:border-blue-500 focus:outline-none"
          required
        />

        <label htmlFor="password" className="label">
          <span className="label-text">Password</span>
        </label>
        <input
          type="password"
          id="password"
          className="input input-sm input-bordered w-full focus:border-blue-500 focus:outline-none"
          required
        />

        <label htmlFor="passwordConfirm" className="label">
          <span className="label-text">Password Confirm</span>
        </label>
        <input
          type="password"
          id="passwordConfirm"
          className="input input-sm input-bordered mb-8 w-full focus:border-blue-500 focus:outline-none"
          required
        />

        <button type="submit" className="btn btn-primary w-full">
          Register
        </button>
      </form>
    </>
  );
}
