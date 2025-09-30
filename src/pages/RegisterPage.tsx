import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const INSTRUMENTS = [
  "lead",
  "acoustic",
  "keys",
  "drums",
  "electric",
  "bgv",
  "violin",
] as const;
type Instrument = (typeof INSTRUMENTS)[number];

export default function RegisterPage() {
  const { registerWithProfile } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleInstrument = (role: Instrument) =>
    setInstruments((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (instruments.length === 0)
      return setError("Pick at least one instrument.");

    try {
      setLoading(true);
      await registerWithProfile({
        email,
        password,
        firstName,
        lastName,
        instruments,
      });
      navigate("/dashboard");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Registration failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto mt-12 p-4 border rounded space-y-4"
    >
      <h2 className="text-xl font-semibold">Register</h2>

      <input
        type="text"
        placeholder="First Name"
        className="w-full border p-2 rounded"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Last Name"
        className="w-full border p-2 rounded"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Email"
        className="w-full border p-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full border p-2 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <fieldset className="border rounded p-3">
        <legend className="text-sm font-medium px-1">Instruments</legend>
        <div className="grid grid-cols-2 gap-2">
          {INSTRUMENTS.map((role) => (
            <label key={role} className="flex items-center gap-2 capitalize">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={instruments.includes(role)}
                onChange={() => toggleInstrument(role)}
              />
              {role}
            </label>
          ))}
        </div>
        <p className="text-xs text-neutral-500 mt-2">Pick all you can serve.</p>
      </fieldset>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Creating account…" : "Sign Up"}
      </button>
    </form>
  );
}
