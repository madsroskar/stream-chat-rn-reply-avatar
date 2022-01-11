import React, {useContext, useEffect, useState} from 'react';
import {Image, Text, View} from 'react-native';
import {
  Avatar,
  Channel,
  Chat,
  MessageInput,
  MessageList,
  Reply,
  useAttachmentPickerContext,
  useMessageContext,
} from 'stream-chat-react-native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {useHeaderHeight} from '@react-navigation/elements';

import {AppContext} from '../AppContext';
import type {
  LocalAttachmentType,
  LocalChannelType,
  LocalCommandType,
  LocalEventType,
  LocalMessageType,
  LocalReactionType,
  LocalUserType,
} from '../types';
import {NavigationParametersList} from '../App';
import {useStreamChat} from '../useStreamChat';

const ReplyOriginalAuthorAvatar = ({message}: {message: LocalMessageType}) => {
  if (
    message === undefined ||
    message.quoted_message?.user?.image === undefined
  ) {
    return null;
  }
  const imageUri = message.quoted_message?.user?.image;

  if (imageUri === undefined) {
    return null;
  }

  const imageSize = 20;
  const imageStyles = {
    borderRadius: imageSize / 2,
    width: imageSize,
    height: imageSize,
  };

  return <Avatar size={20} image={imageUri} />;
};

const CustomReply = () => {
  const {message} = useMessageContext();
  if (message === undefined || message.quoted_message === undefined) {
    return <Reply />;
  }
  const quotedMessage = message.quoted_message;

  const truncatedMessage = quotedMessage.text?.substring(
    0,
    Math.max(50, quotedMessage.text.length),
  );

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        padding: 5,
        borderRadius: 5,
      }}>
      <ReplyOriginalAuthorAvatar message={message as LocalUserType} />
      <Text
        style={{
          maxWidth: '75%',
          alignSelf: 'flex-end',
          marginLeft: 10,
        }}>
        {truncatedMessage}
      </Text>
    </View>
  );
};

interface ChannelScreenProps {
  navigation: StackNavigationProp<NavigationParametersList, 'Channel'>;
}

export const ChannelScreen: React.FC<ChannelScreenProps> = ({
  navigation,
}: ChannelScreenProps) => {
  const {channel, setThread, thread: selectedThread} = useContext(AppContext);
  const headerHeight = useHeaderHeight();
  const {setTopInset} = useAttachmentPickerContext();

  const {client, i18nInstance} = useStreamChat();

  useEffect(() => {
    setTopInset(headerHeight);
  }, [headerHeight, setTopInset]);

  return (
    <Chat client={client} i18nInstance={i18nInstance}>
      <Channel
        channel={channel as any}
        keyboardVerticalOffset={headerHeight}
        Reply={CustomReply}
        thread={selectedThread}>
        <View style={{flex: 1}}>
          <MessageList<
            LocalAttachmentType,
            LocalChannelType,
            LocalCommandType,
            LocalEventType,
            LocalMessageType,
            LocalReactionType,
            LocalUserType
          >
            onThreadSelect={(thread: any) => {
              setThread(thread);
              if (channel?.id) {
                navigation.navigate('Thread');
              }
            }}
          />
          <MessageInput />
        </View>
      </Channel>
    </Chat>
  );
};
