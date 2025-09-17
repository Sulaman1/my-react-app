import { baseImageUrl } from '../../services/request';
import ProfilePic from "../../assets/images/users/1.jpg";
import ImageCell from '../components/ImageCell';

export const renderCellValue = (value, type) => {
  if (value === null || value === undefined) return '-';

  switch (type) {
    case 'DateTime':
      if (!value || value === '1/1/0001 12:00:00 AM' || value === '0001-01-01T00:00:00') return '-';
      return new Date(value).toLocaleDateString();
    case 'Boolean':
      return value ? 'Yes' : 'No';
    case 'String':
      const imageKeywords = ['pic', 'profile', 'img', 'image', 'doc', 'photo'];
      if (typeof value === 'string' && 
          imageKeywords.some(keyword => value.toLowerCase().includes(keyword))) {
        return <ImageCell value={value}  />;
      }
      return value || '-';
    case 'Int32':
    case 'Int64':
      return value || '-';
    case 'Decimal':
      return value ? value.toFixed(2) : '-';
    case 'Array':
      if (Array.isArray(value)) {
        return value.length > 0 ? `${value.length} items` : '-';
      }
      return '-';
    default:
      if (Array.isArray(value)) {
        return value.length > 0 ? `${value.length} items` : '-';
      }
      if (typeof value === 'object' && value !== null) {
        return JSON.stringify(value);
      }
      return value?.toString() || '-';
  }
}; 