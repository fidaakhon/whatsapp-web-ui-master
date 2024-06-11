import { forwardRef, useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import Icon from "common/components/icons";
import useScrollToBottom from "./hooks/useScrollToBottom";
import { getMessages, Message } from "./data/get-messages";
import { messages } from "./data/get-messages";
import {
  ChatMessage,
  ChatMessageFiller,
  ChatMessageFooter,
  Container,
  Date,
  DateWrapper,
  EncryptionMessage,
  MessageGroup,
} from "./styles";
import { MyContext } from "../my-context/MyContext";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

type MessagesListProps = {
  onShowBottomIcon: Function;
  shouldScrollToBottom?: boolean;
};

export default function MessagesList(props: MessagesListProps) {
  const { onShowBottomIcon, shouldScrollToBottom } = props;
  const [numPages, setNumPages] = useState(null);


  const { items, setItems } = useContext(MyContext);

  const params = useParams();
  // const username = params.username;
  // const messages = useMemo(() => {
  //   return getMessages();
  //   // eslint-disable-next-line
  // }, [params.id]);

  const data = useMemo(() => {
    // return messages;
    return items;
  }, [params.id, items]);


  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };



  const filteredMessages = data.filter((message) => message.username === params.id);

  // console.log(filteredMessages)



  const { containerRef, lastMessageRef } = useScrollToBottom(
    onShowBottomIcon,
    shouldScrollToBottom,
    params.id
  );



  return (
    <Container ref={containerRef}>
      <EncryptionMessage>
        <Icon id="lock" className="icon" />
        Messages are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read
        or listen to them. Click to learn more.
      </EncryptionMessage>
      <DateWrapper>
        <Date> TODAY </Date>
      </DateWrapper>
      <MessageGroup>
        {filteredMessages.map((message, i) => {
          if (i === messages.length - 1) {
            return <SingleMessage key={message.id} message={message} ref={lastMessageRef} />;
          } else {
            return <SingleMessage key={message.id} message={message} />;
          }
        })}
      </MessageGroup>
    </Container>
  );
}

const SingleMessage = forwardRef((props: { message: Message }, ref: any) => {
  const { message } = props;

  return (
    <ChatMessage
      key={message.id}
      className={message.isOpponent ? "chat__msg--received" : "chat__msg--sent"}
      ref={ref}
    >
      {message?.imageurl && (
        <img src={message?.imageurl} alt="file" style={{ width: "100%", height: "150px", objectFit: "cover" }} />
      )
      }
      {message?.pdfurl && (
        <div>
          <Document
            file={message?.pdfurl}
          // onLoadSuccess={}
          >
            {Array.from(new Array(2), (el, index) => (
              <Page key={`page_${index + 1}`} pageNumber={index + 1} />
            ))}
          </Document>
        </div>
      )}
      <span>{message.body}</span>
      <ChatMessageFiller />
      <ChatMessageFooter>
        <span>{message.timestamp}</span>
        {!message.isOpponent && (
          <Icon
            id={`${message.messageStatus === "SENT" ? "singleTick" : "doubleTick"}`}
            className={`chat__msg-status-icon ${message.messageStatus === "READ" ? "chat__msg-status-icon--blue" : ""
              }`}
          />
        )}
      </ChatMessageFooter>
    </ChatMessage>
  );
});
