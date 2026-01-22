import { ChatLayout } from "../components/chat-layout";

function ErrorButton() {
   return (
      <button
         onClick={() => {
            throw new Error("This is your first error!");
         }}
      >
         Break the world
      </button>
   );
}

const ChatPage = () => {
   return (
      <>
         <ErrorButton />
         <ChatLayout />;
      </>
   );
};

export default ChatPage;
