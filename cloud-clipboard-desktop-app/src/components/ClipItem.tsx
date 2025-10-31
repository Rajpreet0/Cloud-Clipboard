import type { LucideIcon } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface ClipItemProps {
    type: "text" | "image" | "code";
    data: string;
    icon: LucideIcon;
    deviceType: string;
    clipTimestamp: string;
}

const ClipItem: React.FC<ClipItemProps> = ({type, data, icon: Icon, deviceType, clipTimestamp }) => {

    const detectLanguage = (code: string) => {
        if (/function|const|let|=>/.test(code)) return "javascript";
        if (/import|from|def/.test(code)) return "python";
        if (/public\s+class|System\.out/.test(code)) return "java";
        if (/<\w+>/.test(code)) return "html";
        return "plaintext";
    };


  return (
    <div className="p-4 bg-[#275DAD]/20 rounded-lg flex gap-6 ">
        <div className="bg-dark-gray rounded h-fit p-[5px]">
            <Icon className="text-white" size={24}/>
        </div>
        <div className="w-full">
            {type === "text" && 
                <p className="whitespace-pre-wrap text-sm text-dark-gray break-words font-semibold">{data}</p>
            }

            {type === "code" && (
                <div className="rounded-md overflow-hidden max-w-2xl  border-gray-300">
                    <SyntaxHighlighter
                        language={detectLanguage(data)}
                        style={oneDark}
                        showLineNumbers
                        customStyle={{
                            margin: 0,
                            fontSize: "0.9rem",
                            fontFamily:
                            "'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace",
                            backgroundColor: "#1E1E1E", // force dark background
                        }}
                        codeTagProps={{
                            style: { background: "transparent" },
                        }}
                    >
                        {data.trim()}
                    </SyntaxHighlighter>
                </div>
            )}

            {type === "image" && (
                <img
                    src={`data:image/png;base64,${data}`}
                    className="max-w-xs rounded"
                />
            )}
            <div className="mt-8 flex w-full items-center justify-between">
                <p className="text-sm text-gray-500">{deviceType}</p>
                <p className="text-sm text-gray-500">{clipTimestamp}</p>
            </div>
        </div>
    </div>
  )
}

export default ClipItem