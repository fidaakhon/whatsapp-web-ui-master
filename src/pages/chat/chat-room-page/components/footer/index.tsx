import { useContext, useState } from "react";
import Icon from "common/components/icons";
import {
  AttachButton,
  Button,
  ButtonsContainer,
  IconsWrapper,
  Input,
  SendMessageButton,
  Wrapper,
} from "./styles";
import { Message, getMessages } from "../messages-list/data/get-messages";
import { useParams } from "react-router-dom";
import { MyContext } from "../my-context/MyContext";

const attachButtons = [
  { icon: "attachRooms", label: "Choose room" },
  { icon: "attachContacts", label: "Choose contact" },
  { icon: "attachDocument", label: "Choose document" },
  { icon: "attachCamera", label: "Use camera" },
  { icon: "attachImage", label: "Choose image" },
];

export default function Footer() {
  const [showIcons, setShowIcons] = useState(false);
  const [message, setMessage] = useState("");
  const messages = getMessages();
  const lastMessage = messages[messages.length - 1];
  const isOpponent = lastMessage ? lastMessage.isOpponent : false;

  const { items, setItems } = useContext(MyContext);


  interface CustomMessage extends Message {
    isOpponent: boolean;
  }

  const sendMessage = (username) => {
    const newMessage: CustomMessage = {
      id: (items.length + 1).toString(),
      body: message,
      date: new Date().toLocaleDateString(),
      timestamp: new Date().getHours() + ":" + new Date().getMinutes(),
      messageStatus: "SENT", // Provide a default value
      isOpponent: isOpponent,
      username: username,
    };
    // messages.push(newMessage);
    setItems([...items, newMessage]);
    setMessage("");
    // console.log(messages[messages.length - 1])
  };


  const params = useParams();
  const username = params.id;

  return (
    <Wrapper>
      <IconsWrapper>
        <AttachButton onClick={() => setShowIcons(!showIcons)}>
          <Icon id="attach" className="icon" />
        </AttachButton>
        <ButtonsContainer>
          {attachButtons.map((btn) => (
            <Button showIcon={showIcons} key={btn.label}>
              <Icon id={btn.icon} />
            </Button>
          ))}
        </ButtonsContainer>
      </IconsWrapper>
      <Input placeholder="Type a message here .." value={message} onChange={
        (e) => setMessage(e.target.value)
      } />
      <SendMessageButton onClick={() => sendMessage(username)}>
        <Icon id="send" className="icon" />
      </SendMessageButton>
    </Wrapper>
  );
}
