import ClotheInfo from './ClotheInfo';

export default interface ClotheSet {
    coordination: ClotheInfo[];
    purchasedList: ClotheInfo[];
    likedList: ClotheInfo[];
    dislikedList: ClotheInfo[];
}
