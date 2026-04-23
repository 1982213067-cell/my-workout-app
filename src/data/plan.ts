export interface Exercise {
  id: string;
  name: string;
  setsReps: string;
  cues: string;
  target: string;
  type: 'warmup' | 'main';
}

export const dayA: Exercise[] = [
  {
    id: 'a1',
    name: '仰卧死虫式 (热身)',
    setsReps: '2组 × 15次/侧',
    cues: '下背紧贴地面，对侧手脚伸展。唤醒深层核心。',
    target: '防骨盆前倾、核心预热',
    type: 'warmup'
  },
  {
    id: 'a2',
    name: '弹力带侧卧蚌式',
    setsReps: '2组 × 15次/侧',
    cues: '侧卧骨盆固定，膝盖打开，精准唤醒休眠的臀中肌。',
    target: '填补假胯宽、根治膝内扣',
    type: 'warmup'
  },
  {
    id: 'a3',
    name: '弹力带臀推',
    setsReps: '4组 × 12-15次',
    cues: '肩胛骨靠床沿，骨盆后倾顶起。双膝强力对抗弹力带向外展。',
    target: '饱满臀大肌、纠正膝内扣',
    type: 'main'
  },
  {
    id: 'a4',
    name: '哑铃罗马尼亚硬拉',
    setsReps: '4组 × 10-12次',
    cues: '“足底三点踩实”，臀部向后推。重心均匀，拉伸大腿后侧。',
    target: '大腿后侧紧致、防前侧变粗',
    type: 'main'
  },
  {
    id: 'a5',
    name: '臀导向保加利亚蹲',
    setsReps: '3组 × 8-10次/侧',
    cues: '后脚搭高，上身微前倾。前脚大脚趾死死压住地面防外偏。',
    target: '纠正单腿外侧发力、提臀',
    type: 'main'
  }
];

export const dayB: Exercise[] = [
  {
    id: 'b1',
    name: '门框胸部拉伸 (热身)',
    setsReps: '2组 × 30秒/侧',
    cues: '小臂贴门框身体前倾。拉长紧缩的胸大肌，释放背部空间。',
    target: '打开胸腔、防圆肩代偿',
    type: 'warmup'
  },
  {
    id: 'b2',
    name: '弹力带肩部环绕',
    setsReps: '2组 × 15次',
    cues: '双手宽握弹力带，从身前向后绕过头顶，润滑肩关节囊。',
    target: '肩关节活动度预热',
    type: 'warmup'
  },
  {
    id: 'b3',
    name: '俯身哑铃划船',
    setsReps: '4组 × 10-12次',
    cues: '屈髋俯身45度。先“收紧夹拢肩胛骨”，再屈肘拉重量。',
    target: '加厚薄背、改善圆肩驼背',
    type: 'main'
  },
  {
    id: 'b4',
    name: '弹力带面拉',
    setsReps: '4组 × 15-20次',
    cues: '向面部拉扯。终点必须做到“肩关节外旋”（展示肱二头肌）。',
    target: '纠正肩膀内扣、头前伸',
    type: 'main'
  },
  {
    id: 'b5',
    name: '俯卧 Y-T-W 伸展',
    setsReps: '3组 × 各方位8次',
    cues: '俯卧无负重，大拇指朝上。全程肩膀下沉，唤醒下斜方肌。',
    target: '全方位改善上交叉综合征',
    type: 'main'
  },
  {
    id: 'b6',
    name: '哑铃颈后臂屈伸',
    setsReps: '3组 × 12-15次',
    cues: '手臂高举过头，大臂贴耳下放。在拉长位破坏肌纤维。',
    target: '靶向紧致肱三头肌长头',
    type: 'main'
  }
];

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  desc: string;
}

export const habits: Habit[] = [
  { id: 'h1', name: '缩足运动', emoji: '🦶', desc: '每天15次。大脚趾球向脚跟靠拢抽高足弓' },
  { id: 'h2', name: '滚球放松', emoji: '🎾', desc: '每只脚1分钟。踩球滚压足弓及外侧' },
  { id: 'h3', name: '外侧拉伸', emoji: '🧘', desc: '每侧30秒。坐姿脚底板翻转朝天' },
  { id: 'h4', name: '推墙拉伸', emoji: '🦵', desc: '每侧30秒。面对墙弓步，后脚跟踩死' }
];
