import React from 'react';
import {
  FiPrinter, FiX, FiMail, FiPhone, FiMapPin, FiGlobe, FiLinkedin,
  FiSearch, FiHome, FiUsers, FiBriefcase, FiMessageCircle, FiBell, FiChevronDown, FiUser,
  FiEdit, FiPlus, FiAward, FiLink, FiCamera, FiLogOut, FiMoreHorizontal,
  FiVolume2, FiVolumeX, FiPlay, FiPause, FiCpu, FiSend, FiInfo, FiFileText,
  FiShare2, FiAlertTriangle, FiFile, FiMoon, FiSun, FiHash, FiCalendar,
  FiThumbsUp, FiMessageSquare, FiBookmark, FiImage, FiVideo, FiEye, FiTrendingUp,
  FiLock, FiUnlock, FiCheckCircle, FiClock, FiCheck, FiArrowRight, FiBook, FiBarChart2,
  FiCreditCard, FiSmartphone, FiLayers, FiTrash2
} from 'react-icons/fi';

import { FaStar } from "react-icons/fa";
import { LuGraduationCap } from "react-icons/lu";

const iconMap = {
  'trash': FiTrash2,
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
  'star': FaStar,
  'building': FiBriefcase,
  'graduation-cap': FiAward,
  'course': LuGraduationCap,
  'book': FiBook,
  'chart-bar': FiBarChart2,
  'credit-card': FiCreditCard,
  'smartphone': FiSmartphone,
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
  'calendar': FiCalendar,
  'eye': FiEye,
  'trending-up': FiTrendingUp,
  'lock': FiLock,
  'lock-open': FiUnlock,
  'check-circle': FiCheckCircle,
  'clock': FiClock,
  'check': FiCheck,
  'arrow-right': FiArrowRight,
  'chart-line': FiTrendingUp,
  'map-marker-alt': FiMapPin,
  'project': FiLayers,
  'user': FiUser
};

export default function Icon({ name, size = 16, className = '', ...rest }) {
  const Comp = iconMap[name];
  if (!Comp) return null;
  return <Comp size={size} className={className} {...rest} />;
}
