"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2 } from 'lucide-react'

export default function BulkActionsModal({ 
  isOpen, 
  onClose, 
  courts, 
  timeSlots, 
  selectedDate, 
  onBulkActionCompleted 
}) {
  const [selectedCourts, setSelectedCourts] = useState([])
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([])
  const [action, setAction] = useState('')
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCourtToggle = (courtId) => {
    setSelectedCourts(prev => 
      prev.includes(courtId) 
        ? prev.filter(id => id !== courtId)
        : [...prev, courtId]
    )
  }

  const handleTimeSlotToggle = (time) => {
    setSelectedTimeSlots(prev => 
      prev.includes(time) 
        ? prev.filter(t => t !== time)
        : [...prev, time]
    )
  }

  const handleSelectAllCourts = () => {
    if (selectedCourts.length === courts.length) {
      setSelectedCourts([])
    } else {
      setSelectedCourts(courts.map(c => c.id))
    }
  }

  const handleSelectAllTimeSlots = () => {
    if (selectedTimeSlots.length === timeSlots.length) {
      setSelectedTimeSlots([])
    } else {
      setSelectedTimeSlots([...timeSlots])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!action || selectedCourts.length === 0 || selectedTimeSlots.length === 0) {
      alert('Please select action, courts, and time slots')
      return
    }

    try {
      setIsSubmitting(true)
      
      // Perform bulk action for each court and time slot combination
      const promises = selectedCourts.flatMap(courtId =>
        selectedTimeSlots.map(time =>
          fetch('/api/owner/time-slots/update', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              courtId,
              time,
              date: selectedDate,
              status: action,
              reason
            })
          })
        )
      )

      const results = await Promise.all(promises)
      const failedResults = results.filter(r => !r.ok)

      if (failedResults.length === 0) {
        alert('Bulk action completed successfully!')
        onBulkActionCompleted()
        onClose()
        resetForm()
      } else {
        alert(`Bulk action completed with ${failedResults.length} failures`)
        onBulkActionCompleted()
        onClose()
        resetForm()
      }
    } catch (error) {
      console.error('Error performing bulk action:', error)
      alert('Failed to perform bulk action. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setSelectedCourts([])
    setSelectedTimeSlots([])
    setAction('')
    setReason('')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Actions</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Action</Label>
            <Select value={action} onValueChange={setAction}>
              <SelectTrigger>
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blocked">Block Time Slots</SelectItem>
                <SelectItem value="available">Unblock Time Slots</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Courts</Label>
            <div className="border rounded-lg p-3 max-h-32 overflow-y-auto">
              <div className="flex items-center space-x-2 mb-2">
                <Checkbox 
                  checked={selectedCourts.length === courts.length}
                  onCheckedChange={handleSelectAllCourts}
                />
                <Label className="text-sm font-medium">Select All Courts</Label>
              </div>
              <div className="space-y-2">
                {courts.map((court) => (
                  <div key={court.id} className="flex items-center space-x-2">
                    <Checkbox 
                      checked={selectedCourts.includes(court.id)}
                      onCheckedChange={() => handleCourtToggle(court.id)}
                    />
                    <Label className="text-sm">{court.name}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Label>Time Slots</Label>
            <div className="border rounded-lg p-3 max-h-32 overflow-y-auto">
              <div className="flex items-center space-x-2 mb-2">
                <Checkbox 
                  checked={selectedTimeSlots.length === timeSlots.length}
                  onCheckedChange={handleSelectAllTimeSlots}
                />
                <Label className="text-sm font-medium">Select All Time Slots</Label>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((time) => (
                  <div key={time} className="flex items-center space-x-2">
                    <Checkbox 
                      checked={selectedTimeSlots.includes(time)}
                      onCheckedChange={() => handleTimeSlotToggle(time)}
                    />
                    <Label className="text-sm">{time}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Label>Reason (Optional)</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for this action..."
              rows={2}
            />
          </div>

          <div className="text-sm text-gray-600">
            <p>Selected: {selectedCourts.length} courts × {selectedTimeSlots.length} time slots = {selectedCourts.length * selectedTimeSlots.length} actions</p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Apply Bulk Action'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
