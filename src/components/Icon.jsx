import React from 'react';
import {
  FiPrinter, FiX, FiMail, FiPhone, FiMapPin, FiGlobe, FiLinkedin,
  FiSearch, FiHome, FiUsers, FiBriefcase, FiMessageCircle, FiBell, FiChevronDown, FiUser,
  FiEdit, FiPlus, FiAward, FiLink, FiCamera, FiLogOut, FiMoreHorizontal,
  FiVolume2, FiVolumeX, FiPlay, FiPause, FiCpu, FiSend, FiInfo, FiFileText,
  FiShare2, FiAlertTriangle, FiFile, FiMoon, FiSun, FiHash, FiCalendar,
  FiThumbsUp, FiMessageSquare, FiBookmark, FiImage, FiVideo
} from 'react-icons/fi';

const iconMap = {
  'print': FiPrinter,
  'close': FiX,
  'envelope': FiMail,
  'phone': FiPhone,
  'map-marker': FiMapPin,
  'globe': FiGlobe,
  'linkedin': FiLinkedin,
  'search': FiSearch,
  'home': FiHome,
  'user-friends': FiUsers,
  'briefcase': FiBriefcase,
  'comment-dots': FiMessageCircle,
  'bell': FiBell,
  'caret-down': FiChevronDown,
  'user-circle': FiUser,
  'edit': FiEdit,
  'plus': FiPlus,
  'building': FiBriefcase,
  'graduation-cap': FiAward,
  'link': FiLink,
  'camera': FiCamera,
  'sign-out': FiLogOut,
  'ellipsis-h': FiMoreHorizontal,
  'volume-up': FiVolume2,
  'volume-mute': FiVolumeX,
  'play': FiPlay,
  'pause': FiPause,
  'robot': FiCpu,
  'paper-plane': FiSend,
  'info-circle': FiInfo,
  'file-pdf': FiFileText,
  'share': FiShare2,
  'share-alt': FiShare2,
  'exclamation-triangle': FiAlertTriangle,
  'file-alt': FiFile,
  'moon': FiMoon,
  'sun': FiSun,
  'hashtag': FiHash,
  'calendar-alt': FiCalendar,
  'newspaper': FiFileText,
  'thumbs-up': FiThumbsUp,
  'comment': FiMessageSquare,
  'bookmark': FiBookmark,
  'image': FiImage,
  'video': FiVideo,
  'calendar': FiCalendar
};

export default function Icon({ name, size = 16, className = '', ...rest }) {
  const Comp = iconMap[name];
  if (!Comp) return null;
  return <Comp size={size} className={className} {...rest} />;
}
