import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner";

function SpinnerLoading({text}:{text?:string}) {
  return (
    <Empty className="w-full">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="bg-black">
          <Spinner className="text-white"/>
        </EmptyMedia>
        <EmptyTitle>{text ? text : "Loading page"}</EmptyTitle>
        <EmptyDescription>
          Please wait while we process your request. Do not refresh the page.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

export default SpinnerLoading