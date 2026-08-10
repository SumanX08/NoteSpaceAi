import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

export  function ChatView (props) {
  return (
    <div className="flex h-full flex-col">
      <ChatMessages {...props} />

      <ChatInput
        onSend={props.onSend}
        streaming={props.streaming}
      />
    </div>
  );
}