import React, { useState } from 'react';
import './App.css';
import 'stream-chat-react/dist/css/index.css'
import Cookies from 'universal-cookie';
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';

import { ChannelListContainer, ChannelContainer, Auth } from './components'

const cookies = new Cookies();

const apiKey = 'eub6qdwvynnx'

const client = StreamChat.getInstance(apiKey); //instance of stream chat

const authToken = cookies.get("token");

if (authToken) {
  client.connectUser({
    id: cookies.get('userId'),
    name: cookies.get('username'), 
    fullName: cookies.get('fullName'),
    image: cookies.get('avatarURL'),
    hashedPassword: cookies.get('hashedPassword'),
    email: cookies.get('email'),
  }, authToken)
}

function App() {
  const [createType, setCreateType] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);



  if (!authToken) return <Auth />
  return (
    <div className="app__wrapper">
      <Chat client={client} theme='team light'>
        <ChannelListContainer
          isCreating={isCreating}
          setIsCreating={setIsCreating}
          setCreateType={setCreateType}
          setIsEditing={setIsEditing}
        />
        <ChannelContainer
          isCreating={isCreating}
          setIsCreating={setIsCreating}
          setIsEditing={setIsEditing}
          isEditing={isEditing}
          createType={createType}
        />
      </Chat>
    </div>
  );
}

export default App;
