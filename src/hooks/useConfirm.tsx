import { Button } from "../components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"
import React, { useState } from "react";


type ConfirmDialogProps = {
  renderChildren?: () => React.ReactNode
}


export const useConfirm = (
  title: string,
  message: string
): [(props?: ConfirmDialogProps) => React.JSX.Element, () => Promise<unknown>] => {
  const [promise, setPromise] = useState<{ resolve: (value: boolean) => void} | null>(null)

  const confirm = () => new Promise((resolve) => {
    setPromise({ resolve })
  })

  const handleClose = () => {
    setPromise(null)
  }

  const handleCancel = () => {
    promise?.resolve(false)
    handleClose()
  }

  const handleConfirm = () => {
    promise?.resolve(true)
    handleClose()
  }

  const ConfirmDialog = (props?: ConfirmDialogProps) => {
    // const { children } = props ?? {}

    return (
      <Dialog open={promise !== null}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {title}
            </DialogTitle>
            <DialogDescription>
              {message}
            </DialogDescription> 
          </DialogHeader>
          { props?.renderChildren &&
            <div>
              { props.renderChildren() }

            </div>
          }
          <DialogFooter className="pt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                type="submit"
                onClick={handleConfirm}
              >
                Confirm
              </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return [ConfirmDialog, confirm]
}

