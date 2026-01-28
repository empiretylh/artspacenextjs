import { Spinner } from "../ui/spinner"

const UpdatingLoader = () => {
  return (
    <div className="absolute flex items-center gap-2 top-20 left-1/2 -translate-x-1/2 z-50 bg-gray-200 p-3 rounded-lg"><Spinner /> Updating ...</div>
  )
}

export default UpdatingLoader
