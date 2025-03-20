export interface Discussion {
  id: string
  title: string
  content: string
  likes: number
  comments: number
  date: string
  userId: string
  userName: string
  userImage?: string
  userBadge: string
}

export interface Comment {
  id: string
  content: string
  date: string
  userId: string
  userName: string
  userImage?: string
  userBadge: string
}

