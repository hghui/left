import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const ReminderWrapper = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--background);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
  z-index: 99999;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 99998;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-color);
  font-size: 20px;
  
  &:hover {
    opacity: 0.8;
  }
`;

const ReminderContent = styled.div`
  color: var(--text-color);
  text-align: center;
  
  h3 {
    margin-bottom: 15px;
    font-size: 18px;
  }
  
  p {
    margin: 10px 0;
    font-size: 14px;
    line-height: 1.5;
  }
`;

const TimeReminder = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [reminder, setReminder] = useState(null);

  useEffect(() => {
    const fetchAndShowReminder = async () => {
      try {
        const url = 'https://api.kuleu.com/api/getGreetingMessage?type=json';
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.code === 200) {
          setReminder({
            title: data.data.currentTime,
            content: data.data.greeting,
            tip: data.data.tip
          });
          setIsVisible(true);
        }
      } catch (error) {
        setReminder({
          title: new Date().toLocaleTimeString(),
          content: getDefaultGreeting(),
          tip: '欢迎访问！'
        });
        setIsVisible(true);
      }
    };

    const getDefaultGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 6) return '夜深了，注意休息哦！';
      if (hour < 9) return '早安，祝您开启愉快的一天！';
      if (hour < 12) return '上午好，工作顺利！';
      if (hour < 14) return '中午好，记得休息片刻！';
      if (hour < 18) return '下午好，继续加油！';
      if (hour < 22) return '晚上好，记得劳逸结合！';
      return '夜深了，注意休息哦！';
    };

    let isComponentMounted = true;

    if (isComponentMounted) {
      fetchAndShowReminder();
    }

    const intervalId = setInterval(() => {
      if (isComponentMounted) {
        fetchAndShowReminder();
      }
    }, 60000);

    return () => {
      isComponentMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && reminder && (
        <>
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          <ReminderWrapper
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 25 
            }}
          >
            <CloseButton onClick={handleClose}>×</CloseButton>
            <ReminderContent>
              <h3>{reminder.title}</h3>
              <p>{reminder.content}</p>
              {reminder.tip && <p>{reminder.tip}</p>}
            </ReminderContent>
          </ReminderWrapper>
        </>
      )}
    </AnimatePresence>
  );
};

export default TimeReminder; 