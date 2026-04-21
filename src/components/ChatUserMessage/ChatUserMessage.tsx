import { CardLayout } from '../Card/CardLayout'
import { RichTextDisplayField } from '../RichText/RichTextDisplayField'
import { TextItem } from '../RichText/TextItem'

export interface ChatUserMessageProps {
  message: string
}

export function ChatUserMessage({ message }: ChatUserMessageProps) {
  return (
    <CardLayout
      shape="ROUNDED"
      padding="LESS"
      marginBelow="EVEN_LESS"
      showBorder={false}
      showShadow={false}
      style="#EDEEFA"
      className="w-fit max-w-2xl ml-auto"
    >
      <RichTextDisplayField
        value={[<TextItem text={message} size="STANDARD" color="STANDARD" />]}
        marginBelow="NONE"
      />
    </CardLayout>
  )
}
