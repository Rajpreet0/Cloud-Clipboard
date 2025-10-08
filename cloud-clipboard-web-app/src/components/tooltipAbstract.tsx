import React from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

interface TooltipAbstractProps {
    children: React.ReactNode;
    content: string;
}

const TooltipAbstract: React.FC<TooltipAbstractProps> = ({children, content}) => {
  return (
    <Tooltip>
        <TooltipTrigger asChild>
            {children}
        </TooltipTrigger>
        <TooltipContent>
            {content}
        </TooltipContent>
    </Tooltip>
  )
}

export default TooltipAbstract