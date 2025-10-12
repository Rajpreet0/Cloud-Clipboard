import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PairDevice = () => {
  return (
    <div className="flex flex-col items-center justify-center  bg-white">
      <h1 className="text-2xl font-bold mb-4">Pair your Device</h1>
      <p className="text-gray-600 mb-6 text-center max-w-sm">
        Enter the pairing code displayed in your web dashboard to connect this device
        with your Cloud Clipboard account.
      </p>

      <input
        type="text"
        placeholder="Enter pairing code"
        className="border border-gray-300 rounded-lg px-4 py-2 w-64 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <Button
        className="mt-4 px-6 py-2 !bg-blue-600 text-white rounded-lg !hover:bg-blue-700 transition"
      >
        Pair
      </Button>

      <Link to="/" className="mt-8 text-blue-500 hover:underline">
        ← Back to Home
      </Link>
    </div>
  )
}

export default PairDevice