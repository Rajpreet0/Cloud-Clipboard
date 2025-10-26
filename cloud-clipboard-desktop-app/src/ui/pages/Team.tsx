import Layout from "@/components/Layout"
import TeamListItem from "@/components/TeamListItem"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PlusIcon } from "lucide-react"

const Team = () => {
  return (
    <Layout>
      <div className="flex items-center w-full justify-between gap-2">
        <p className="font-bold text-3xl text-dark-gray mt-2">Teams</p>
        <Dialog>
          <DialogTrigger>
            <Button className="bg-dark-gray font-medium cursor-pointer">
              <PlusIcon/> Create Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Create a Team</DialogTitle>
              <DialogDescription>
                  Here you can create a Team for sharing copied Resources
                  very easily.
              </DialogDescription>
            </DialogHeader>
            <div>
              {/* Team Name */}
              {/* Team Settings */}
              {/* Invite Team Members via Link */}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" className="cursor-pointer ">Cancel</Button>
              </DialogClose>
              <Button className="cursor-pointer bg-blue text-white">Create Team</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-col mt-10 gap-4">
        <TeamListItem
          teamTitle="Engineering"
          teamNumber={5}
          teamLink=""/>
      </div>
    </Layout>
  )
}

export default Team
