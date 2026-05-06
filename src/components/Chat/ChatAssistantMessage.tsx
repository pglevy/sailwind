import { RichTextDisplayField } from '../RichText/RichTextDisplayField'
import { TextItem } from '../RichText/TextItem'

export interface ChatAssistantMessageProps {
  message: string
}

export function ChatAssistantMessage({ message }: ChatAssistantMessageProps) {
  return (
    <div className="w-full px-0" role="article">
      <RichTextDisplayField
        value={[<TextItem text={message} size="STANDARD" color="STANDARD" />]}
        marginBelow="EVEN_LESS"
      />
    </div>
  )
}
