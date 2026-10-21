/** @author Beriman Juliano */
import './style.css';
import './responsive.css';
import './visual.css';
import { setupGallery } from './gallery';
import { renderIcons } from './icons';
import { setupPlayer } from './player';
import { setupMotion } from './motion';
import { setupUI } from './ui';
renderIcons();
setupUI();
setupPlayer();
setupGallery();
setupMotion();
