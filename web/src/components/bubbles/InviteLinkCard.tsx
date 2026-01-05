import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface InviteLinkCardProps {
  inviteCode: string
}

export default function InviteLinkCard({ inviteCode }: InviteLinkCardProps) {
  const [copied, setCopied] = useState(false)

  const inviteUrl = `${window.location.origin}/join/${inviteCode}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="bg-gradient-to-br from-ocean-50 to-sage-50 rounded-lg p-4 border-2 border-ocean-200">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1">
          <h4 className="text-sm font-medium text-neutral-700 mb-1">Invite Link</h4>
          <p className="text-xs text-neutral-500 mb-3">
            Share this link to invite people to your bubble
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          readOnly
          value={inviteUrl}
          className="flex-1 px-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-neutral-700 font-mono focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
        />
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-ocean-600 hover:bg-ocean-700 active:bg-ocean-800 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2 flex items-center gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span className="hidden sm:inline">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span className="hidden sm:inline">Copy</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
