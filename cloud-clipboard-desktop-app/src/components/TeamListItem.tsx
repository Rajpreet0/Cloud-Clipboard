import { ChevronRight, Users } from "lucide-react";
import { useNavigate } from "react-router";

interface TeamListItemProps {
    teamTitle: string;
    teamNumber: number;
    teamLink: string;
}

const TeamListItem: React.FC<TeamListItemProps> = ({ teamTitle, teamNumber, teamLink}) => {

    const navigate = useNavigate();

  return (
    <div
        onClick={() => navigate(teamLink)} 
        className="w-[85%] flex items-center justify-between bg-dark-gray/90 p-4 rounded-md cursor-pointer">
        <div className="flex gap-4 items-center">
            <div className="bg-blue p-4 rounded-full">
                <Users className="text-white"/>
            </div>
            <div>
                <h2 className="text-white text-xl">{teamTitle}</h2>
                <p className="text-white-gray text-sm">{teamNumber} members</p>
            </div>
        </div>
        <ChevronRight className="text-white"/>
    </div>
  )
}

export default TeamListItem