import React from 'react'
import { Avatar, useChatContext } from 'stream-chat-react'

const TeamChannelPreview = ({ setActiveChannel, setIsCreating, setIsEditing, setToggleContainer, channel, type }) => {
    const { channel: activeChannel, client } = useChatContext(); //hook

    //*preview for channel with multiple users
    const ChannelPreview = () => (
        <p className='channel-preview__item'>
            # {channel?.data?.name || channel?.data?.id}
        </p>
    )



    //*preview for direct messages
    const DirectPreview = () => {
        //will give us values of all the items in that specific members object & we filter it
        const members = Object.values(channel.state.members).filter(({ user }) => user.id != client.userID)
        return (
            <div className='channel-preview__item single'>
                <Avatar
                    image={members[0]?.user?.image}
                    name={members[0]?.user?.fullName || members[0]?.user?.id}
                    size={24}
                />
                <p>
                    {members[0]?.user?.fullName || members[0]?.user?.id}
                </p>
            </div>
        )
    }

    return (
        <div className={
            channel?.id === activeChannel?.id
                ? 'channel-preview__wrapper__selected'
                : 'channel-preview__wrapper'
        }
            onClick={() => {
                setIsCreating(false);
                setIsEditing(false);
                setActiveChannel(channel);
                if (setToggleContainer) {
                    setToggleContainer((prevState) => !prevState)
                }
            }}
        >
            {type === 'team' ? <ChannelPreview /> : <DirectPreview />}
        </div>
    )
}

export default TeamChannelPreview
