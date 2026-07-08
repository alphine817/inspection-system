import { useState } from 'react'
import { Save, UserCircle } from 'lucide-react'
import PortalPageHeader from '../../components/portal/PortalPageHeader'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import useAuth from '../../hooks/useAuth'
import { getInspectorProfile, updateInspectorProfile } from '../../utils/tenantStorage'

export default function InspectorProfilePage() {
  const { user } = useAuth()
  const saved = getInspectorProfile(user?.id)

  const [phone, setPhone] = useState(saved?.phone ?? '')
  const [certification, setCertification] = useState(saved?.certification ?? '')
  const [availability, setAvailability] = useState(saved?.availability ?? 'weekdays')
  const [serviceArea, setServiceArea] = useState(saved?.serviceArea ?? '')
  const [savedMessage, setSavedMessage] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    updateInspectorProfile(user.id, {
      phone,
      certification,
      availability,
      serviceArea,
    })
    setSavedMessage('Profile updated successfully.')
    setTimeout(() => setSavedMessage(''), 3000)
  }

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Profile"
        description="Manage your contact details, certifications, and field availability."
      />

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 sm:p-6"
      >
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400">
            <UserCircle className="h-8 w-8" aria-hidden="true" />
          </div>
          <div>
            <p className="text-base font-bold text-slate-900 dark:text-slate-100">{user?.displayName}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
          </div>
        </div>

        {savedMessage && (
          <p className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300" role="status">
            {savedMessage}
          </p>
        )}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input
            name="phone"
            label="Phone number"
            type="tel"
            placeholder="+254 712 345 678"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
          <Input
            name="certification"
            label="Certification"
            placeholder="Certified Residential Inspector"
            value={certification}
            onChange={(event) => setCertification(event.target.value)}
          />
          <Input
            name="availability"
            label="Availability"
            placeholder="Weekdays 8 AM – 5 PM"
            value={availability}
            onChange={(event) => setAvailability(event.target.value)}
          />
          <Input
            name="serviceArea"
            label="Service area"
            placeholder="Nairobi metro, Westlands"
            value={serviceArea}
            onChange={(event) => setServiceArea(event.target.value)}
          />
        </div>

        <Button type="submit" className="mt-6">
          <Save className="h-4 w-4" aria-hidden="true" />
          Save profile
        </Button>
      </form>
    </div>
  )
}
