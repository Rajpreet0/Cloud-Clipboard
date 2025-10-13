import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const PairDevice = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Pair your Device</h1>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        Enter the pairing code displayed in your web dashboard to connect this device
        with your Cloud Clipboard account.
      </p>

      <Input
        type="text"
        placeholder="Enter pairing code"
        maxLength={9}
        className="mt-12 rounded-lg px-4 py-2 w-[300px] h-[40px] font-bold !text-lg text-center text-blue border-2 border-gray-300 focus:border-blue uppercase 
        tracking-widest placeholder:tracking-normal placeholder:normal-case placeholder:font-normal placeholder:!text-sm"
      />

      {/* Pair Device Button */}
      <Button
        className="w-[150px] h-[35px] mt-12 rounded-lg text-lg bg-blue text-white hover:scale-105 hover:shadow-lg transition-all cursor-pointer"
      >
        Pair 
      </Button>

      <Link to="/" className="mt-12 !text-blue hover:underline">
        ← Back to Home
      </Link>
    </div>
  )
}

export default PairDevice