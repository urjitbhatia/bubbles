import MemberItem from './MemberItem'

interface Member {
  id: string
  name: string
  avatar?: string
  role: 'admin' | 'member'
}

interface MemberListProps {
  members: Member[]
  currentUserId?: string
  canManage?: boolean
  onPromoteToAdmin?: (userId: string) => void
  onRemoveMember?: (userId: string) => void
}

export default function MemberList({
  members,
  currentUserId,
  canManage = false,
  onPromoteToAdmin,
  onRemoveMember,
}: MemberListProps) {
  // Sort admins first
  const sortedMembers = [...members].sort((a, b) => {
    if (a.role === 'admin' && b.role !== 'admin') return -1
    if (a.role !== 'admin' && b.role === 'admin') return 1
    return 0
  })

  return (
    <div className="divide-y divide-neutral-200">
      {sortedMembers.map((member) => (
        <MemberItem
          key={member.id}
          id={member.id}
          name={member.name}
          avatar={member.avatar}
          role={member.role}
          isCurrentUser={member.id === currentUserId}
          canManage={canManage}
          onPromoteToAdmin={onPromoteToAdmin}
          onRemoveMember={onRemoveMember}
        />
      ))}
    </div>
  )
}
