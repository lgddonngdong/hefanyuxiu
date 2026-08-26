/**
 * Mock data for development and preview without Supabase.
 * Contains all 241 plant records from the Excel file.
 */

function getLifeForm(family: string): string {
  const treeFamilies = ['桑科', '榆科', '杨柳科', '芸香科', '苦木科', '楝科', '樟科', '无患子科', '鼠李科', '卫矛科', '大戟科'];
  if (treeFamilies.includes(family)) return '木本';
  return '草本';
}

function isNative(name: string): boolean {
  const exoticKeywords = ['北美', '外来', '归化', '喜旱', '阿拉伯', '白车轴草', '白花草木樨', '草木樨', '刺槐', '南苜蓿', '天蓝苜蓿', '小苜蓿', '苦苣菜', '续断菊', '野莴苣', '药用蒲公英', '曼陀罗', '苘麻', '蒺藜', '藜', '猪毛菜', '厚萼凌霄', '女贞', '龙葵', '滨菊', '菊蒿', '白柳', '黑杨', '银白杨', '苜蓿'];
  for (const kw of exoticKeywords) {
    if (name.includes(kw)) return false;
  }
  return true;
}

function isInvasive(name: string): boolean {
  const invasiveNames = [
    '喜旱莲子草', '豚草', '小蓬草', '一年蓬', '苏门白酒草', '钻叶紫菀',
    '反枝苋', '北美苋', '鬼针草', '大狼耙草', '刺苍耳', '野燕麦',
    '阿拉伯婆婆纳', '北美车前', '北美独行菜', '匍匐大戟', '斑地锦草',
    '白苞猩猩草', '粗毛牛膝菊', '圆叶牵牛', '牵牛', '小花山桃草', '山桃草',
    '紫穗槐', '黄花酢浆草', '梣叶槭', '香丝草', '苍耳',
    '白车轴草', '白花草木樨', '草木樨', '刺槐', '南苜蓿', '天蓝苜蓿',
    '小苜蓿', '苦苣菜', '续断菊', '野莴苣',
  ];
  return invasiveNames.includes(name);
}

const habitats = ['河岸', '田野', '路旁', '草地', '灌丛', '林缘', '湿地', '荒地'];
const locations = ['郑州市惠济区', '洛阳市孟津区', '开封市龙亭区', '新乡市原阳县', '焦作市武陟县',
  '三门峡市湖滨区', '濮阳市华龙区', '郑州市中牟县', '洛阳市新安县', '商丘市梁园区'];

const rawData: [number, string, string, string, string][] = [
  [1, '节节草', 'Equisetum ramosissimum', '木贼科', '木贼属'],
  [2, '木贼', 'Equisetum hyemale', '木贼科', '木贼属'],
  [3, '泽泻', 'Alisma plantago-aquatica', '泽泻科', '泽泻属'],
  [4, '麦冬', 'Ophiopogon japonicus', '天门冬科', '沿阶草属'],
  [5, '沿阶草', 'Ophiopogon bodinieri', '天门冬科', '沿阶草属'],
  [6, '薯蓣', 'Dioscorea polystachya', '薯蓣科', '薯蓣属'],
  [7, '马蔺', 'Iris lactea', '鸢尾科', '鸢尾属'],
  [8, '野鸢尾', 'Iris dichotoma', '鸢尾科', '鸢尾属'],
  [9, '畦畔莎草', 'Cyperus haspan', '莎草科', '莎草属'],
  [10, '香附子', 'Cyperus rotundus', '莎草科', '莎草属'],
  [11, '水葱', 'Schoenoplectus tabernaemontani', '莎草科', '水葱属'],
  [12, '白茅', 'Imperata cylindrica', '禾本科', '白茅属'],
  [13, '白羊草', 'Bothriochloa ischaemum', '禾本科', '孔颖草属'],
  [14, '稗', 'Echinochloa crusgalli', '禾本科', '稗属'],
  [15, '小旱稗', 'Echinochloa colona', '禾本科', '稗属'],
  [16, '鹅观草', 'Roegneria kamoji', '禾本科', '鹅观草属'],
  [17, '拂子茅', 'Calamagrostis epigejos', '禾本科', '拂子茅属'],
  [18, '狗尾草', 'Setaria viridis', '禾本科', '狗尾草属'],
  [19, '狗牙根', 'Cynodon dactylon', '禾本科', '狗牙根属'],
  [20, '大画眉草', 'Eragrostis cilianensis', '禾本科', '画眉草属'],
  [21, '画眉草', 'Eragrostis pilosa', '禾本科', '画眉草属'],
  [22, '小画眉草', 'Eragrostis minor', '禾本科', '画眉草属'],
  [23, '黑麦草', 'Lolium perenne', '禾本科', '黑麦草属'],
  [24, '亨利马唐', 'Digitaria henryi', '禾本科', '马唐属'],
  [25, '马唐', 'Digitaria sanguinalis', '禾本科', '马唐属'],
  [26, '纤维马唐', 'Digitaria fibrosa', '禾本科', '马唐属'],
  [27, '荩草', 'Arthraxon hispidus', '禾本科', '荩草属'],
  [28, '蓝羊茅', 'Festuca glauca', '禾本科', '羊茅属'],
  [29, '紫羊茅', 'Festuca rubra', '禾本科', '羊茅属'],
  [30, '芦苇', 'Phragmites australis', '禾本科', '芦苇属'],
  [31, '雀麦', 'Bromus japonicus', '禾本科', '雀麦属'],
  [32, '无芒雀麦', 'Bromus inermis', '禾本科', '雀麦属'],
  [33, '柠檬草', 'Cymbopogon citratus', '禾本科', '香茅属'],
  [34, '牛筋草', 'Eleusine indica', '禾本科', '穇属'],
  [35, '披碱草', 'Elymus dahuricus', '禾本科', '披碱草属'],
  [36, '芒', 'Miscanthus sinensis', '禾本科', '芒属'],
  [37, '燕麦', 'Avena sativa', '禾本科', '燕麦属'],
  [38, '野燕麦', 'Avena fatua', '禾本科', '燕麦属'],
  [39, '虉草', 'Phalaris arundinacea', '禾本科', '虉草属'],
  [40, '早熟禾', 'Poa annua', '禾本科', '早熟禾属'],
  [41, '蔗茅', 'Saccharum arundinaceum', '禾本科', '甘蔗属'],
  [42, '地毯草', 'Axonopus compressus', '禾本科', '地毯草属'],
  [43, '构', 'Broussonetia papyrifera', '桑科', '构属'],
  [44, '鸡桑', 'Morus australis', '桑科', '桑属'],
  [45, '桑', 'Morus alba', '桑科', '桑属'],
  [46, '水蛇麻', 'Fatoua villosa', '桑科', '水蛇麻属'],
  [47, '苎麻', 'Boehmeria nivea', '荨麻科', '苎麻属'],
  [48, '榔榆', 'Ulmus parvifolia', '榆科', '榆属'],
  [49, '榆', 'Ulmus pumila', '榆科', '榆属'],
  [50, '朴', 'Celtis sinensis', '朴科', '朴属'],
  [51, '葎草', 'Humulus scandens', '朴科', '葎草属'],
  [52, '萹蓄', 'Polygonum aviculare', '蓼科', '蓼属'],
  [53, '春蓼', 'Polygonum persicaria', '蓼科', '蓼属'],
  [54, '酸模叶蓼', 'Polygonum lapathifolium', '蓼科', '蓼属'],
  [55, '齿果酸模', 'Rumex dentatus', '蓼科', '酸模属'],
  [56, '钝叶酸模', 'Rumex obtusifolius', '蓼科', '酸模属'],
  [57, '酸模', 'Rumex acetosa', '蓼科', '酸模属'],
  [58, '皱叶酸模', 'Rumex crispus', '蓼科', '酸模属'],
  [59, '藜', 'Chenopodium album', '藜科', '藜属'],
  [60, '猪毛菜', 'Salsola collina', '藜科', '猪毛菜属'],
  [61, '北美苋', 'Amaranthus blitoides', '苋科', '苋属'],
  [62, '反枝苋', 'Amaranthus retroflexus', '苋科', '苋属'],
  [63, '土牛膝', 'Achyranthes aspera', '苋科', '牛膝属'],
  [64, '喜旱莲子草', 'Alternanthera philoxeroides', '苋科', '莲子草属'],
  [65, '马齿苋', 'Portulaca oleracea', '马齿苋科', '马齿苋属'],
  [66, '头石竹', 'Dianthus barbatus', '石竹科', '石竹属'],
  [67, '商陆', 'Phytolacca acinosa', '商陆科', '商陆属'],
  [68, '茴茴蒜', 'Ranunculus chinensis', '毛茛科', '毛茛属'],
  [69, '石龙芮', 'Ranunculus sceleratus', '毛茛科', '毛茛属'],
  [70, '巴婆果', 'Asimina triloba', '番荔枝科', '巴婆果属'],
  [71, '樟', 'Cinnamomum camphora', '樟科', '樟属'],
  [72, '朝天委陵菜', 'Potentilla supina', '蔷薇科', '委陵菜属'],
  [73, '轮叶委陵菜', 'Potentilla verticillaris', '蔷薇科', '委陵菜属'],
  [74, '委陵菜', 'Potentilla chinensis', '蔷薇科', '委陵菜属'],
  [75, '火棘', 'Pyracantha fortuneana', '蔷薇科', '火棘属'],
  [76, '茅莓', 'Rubus parvifolius', '蔷薇科', '悬钩子属'],
  [77, '蛇莓', 'Duchesnea indica', '蔷薇科', '蛇莓属'],
  [78, '桃', 'Amygdalus persica', '蔷薇科', '桃属'],
  [79, '白车轴草', 'Trifolium repens', '豆科', '车轴草属'],
  [80, '白花草木樨', 'Melilotus albus', '豆科', '草木樨属'],
  [81, '草木樨', 'Melilotus officinalis', '豆科', '草木樨属'],
  [82, '刺果甘草', 'Glycyrrhiza pallidiflora', '豆科', '甘草属'],
  [83, '甘草', 'Glycyrrhiza uralensis', '豆科', '甘草属'],
  [84, '刺槐', 'Robinia pseudoacacia', '豆科', '刺槐属'],
  [85, '大豆', 'Glycine max', '豆科', '大豆属'],
  [86, '野大豆', 'Glycine soja', '豆科', '大豆属'],
  [87, '大花野豌豆', 'Vicia bungei', '豆科', '野豌豆属'],
  [88, '野豌豆', 'Vicia sepium', '豆科', '野豌豆属'],
  [89, '胡枝子', 'Lespedeza bicolor', '豆科', '胡枝子属'],
  [90, '截叶铁扫帚', 'Lespedeza cuneata', '豆科', '胡枝子属'],
  [91, '兴安胡枝子', 'Lespedeza davurica', '豆科', '胡枝子属'],
  [92, '中华胡枝子', 'Lespedeza chinensis', '豆科', '胡枝子属'],
  [93, '苦参', 'Sophora flavescens', '豆科', '苦参属'],
  [94, '绿豆', 'Vigna radiata', '豆科', '豇豆属'],
  [95, '米口袋', 'Gueldenstaedtia verna', '豆科', '米口袋属'],
  [96, '苜蓿', 'Medicago sativa', '豆科', '苜蓿属'],
  [97, '南苜蓿', 'Medicago polymorpha', '豆科', '苜蓿属'],
  [98, '天蓝苜蓿', 'Medicago lupulina', '豆科', '苜蓿属'],
  [99, '小苜蓿', 'Medicago minima', '豆科', '苜蓿属'],
  [100, '三点金', 'Desmodium triflorum', '豆科', '山蚂蝗属'],
  [101, '香槐', 'Cladrastis wilsonii', '豆科', '香槐属'],
  [102, '紫穗槐', 'Amorpha fruticosa', '豆科', '紫穗槐属'],
  [103, '关节酢浆草', 'Oxalis articulata', '酢浆草科', '酢浆草属'],
  [104, '黄花酢浆草', 'Oxalis pes-caprae', '酢浆草科', '酢浆草属'],
  [105, '酢浆草', 'Oxalis corniculata', '酢浆草科', '酢浆草属'],
  [106, '牻牛儿苗', 'Erodium stephanianum', '牻牛儿苗科', '牻牛儿苗属'],
  [107, '蒺藜', 'Tribulus terrestris', '蒺藜科', '蒺藜属'],
  [108, '白苞猩猩草', 'Euphorbia heterophylla', '大戟科', '大戟属'],
  [109, '斑地锦草', 'Euphorbia maculata', '大戟科', '大戟属'],
  [110, '地锦草', 'Euphorbia humifusa', '大戟科', '大戟属'],
  [111, '匍匐大戟', 'Euphorbia serpens', '大戟科', '大戟属'],
  [112, '泽漆', 'Euphorbia helioscopia', '大戟科', '大戟属'],
  [113, '铁苋菜', 'Acalypha australis', '大戟科', '铁苋菜属'],
  [114, '乌桕', 'Triadica sebifera', '大戟科', '乌桕属'],
  [115, '油桐', 'Vernicia fordii', '大戟科', '油桐属'],
  [116, '白杜', 'Euonymus maackii', '卫矛科', '卫矛属'],
  [117, '扶芳藤', 'Euonymus fortunei', '卫矛科', '卫矛属'],
  [118, '三叶漆', 'Toxicodendron delavayi', '漆树科', '漆树属'],
  [119, '柑橘', 'Citrus reticulata', '芸香科', '柑橘属'],
  [120, '花椒', 'Zanthoxylum bungeanum', '芸香科', '花椒属'],
  [121, '臭椿', 'Ailanthus altissima', '苦木科', '臭椿属'],
  [122, '楝', 'Melia azedarach', '楝科', '楝属'],
  [123, '梣叶槭', 'Acer negundo', '无患子科', '槭属'],
  [124, '栾', 'Koelreuteria paniculata', '无患子科', '栾属'],
  [125, '枣', 'Ziziphus jujuba', '鼠李科', '枣属'],
  [126, '乌头叶蛇葡萄', 'Ampelopsis aconitifolia', '葡萄科', '蛇葡萄属'],
  [127, '苘麻', 'Abutilon theophrasti', '锦葵科', '苘麻属'],
  [128, '蜀葵', 'Alcea rosea', '锦葵科', '蜀葵属'],
  [129, '千屈菜', 'Lythrum salicaria', '千屈菜科', '千屈菜属'],
  [130, '紫薇', 'Lagerstroemia indica', '千屈菜科', '紫薇属'],
  [131, '山桃草', 'Gaura lindheimeri', '柳叶菜科', '山桃草属'],
  [132, '小花山桃草', 'Gaura parviflora', '柳叶菜科', '山桃草属'],
  [133, '绞股蓝', 'Gynostemma pentaphyllum', '葫芦科', '绞股蓝属'],
  [134, '甜瓜', 'Cucumis melo', '葫芦科', '黄瓜属'],
  [135, '常春藤', 'Hedera nepalensis', '五加科', '常春藤属'],
  [136, '白柳', 'Salix alba', '杨柳科', '柳属'],
  [137, '旱柳', 'Salix matsudana', '杨柳科', '柳属'],
  [138, '黑杨', 'Populus nigra', '杨柳科', '杨属'],
  [139, '银白杨', 'Populus alba', '杨柳科', '杨属'],
  [140, '北美独行菜', 'Lepidium virginicum', '十字花科', '独行菜属'],
  [141, '独行菜', 'Lepidium apetalum', '十字花科', '独行菜属'],
  [142, '蔊菜', 'Rorippa indica', '十字花科', '蔊菜属'],
  [143, '沼生蔊菜', 'Rorippa palustris', '十字花科', '蔊菜属'],
  [144, '荠', 'Capsella bursa-pastoris', '十字花科', '荠属'],
  [145, '芥菜', 'Brassica juncea', '十字花科', '芸薹属'],
  [146, '补血草', 'Limonium sinense', '白花丹科', '补血草属'],
  [147, '二色补血草', 'Limonium bicolor', '白花丹科', '补血草属'],
  [148, '柽柳', 'Tamarix chinensis', '柽柳科', '柽柳属'],
  [149, '多枝柽柳', 'Tamarix ramosissima', '柽柳科', '柽柳属'],
  [150, '帚石南', 'Calluna vulgaris', '杜鹃花科', '帚石南属'],
  [151, '女贞', 'Ligustrum lucidum', '木犀科', '女贞属'],
  [152, '小蜡', 'Ligustrum sinense', '木犀科', '女贞属'],
  [153, '黄荆', 'Vitex negundo', '马鞭草科', '牡荆属'],
  [154, '牡荆', 'Vitex negundo var.cannabifolia', '马鞭草科', '牡荆属'],
  [155, '鸡屎藤', 'Paederia scandens', '茜草科', '鸡屎藤属'],
  [156, '拉拉藤', 'Galium spurium', '茜草科', '拉拉藤属'],
  [157, '卵叶茜草', 'Rubia ovatifolia', '茜草科', '茜草属'],
  [158, '茜草', 'Rubia cordifolia', '茜草科', '茜草属'],
  [159, '地稍瓜', 'Cynanchum thesioides', '夹竹桃科', '鹅绒藤属'],
  [160, '鹅绒藤', 'Cynanchum chinense', '夹竹桃科', '鹅绒藤属'],
  [161, '柳叶白前', 'Cynanchum stauntonii', '夹竹桃科', '鹅绒藤属'],
  [162, '毛白前', 'Cynanchum mooreanum', '夹竹桃科', '鹅绒藤属'],
  [163, '牛皮消', 'Cynanchum auriculatum', '夹竹桃科', '鹅绒藤属'],
  [164, '杠柳', 'Periploca sepium', '夹竹桃科', '杠柳属'],
  [165, '华萝藦', 'Metaplexis hemsleyana', '夹竹桃科', '萝藦属'],
  [166, '罗布麻', 'Apocynum venetum', '夹竹桃科', '罗布麻属'],
  [167, '打碗花', 'Calystegia hederacea', '旋花科', '打碗花属'],
  [168, '牵牛', 'Ipomoea nil', '旋花科', '番薯属'],
  [169, '小心叶薯', 'Ipomoea obscura', '旋花科', '番薯属'],
  [170, '圆叶牵牛', 'Ipomoea purpurea', '旋花科', '番薯属'],
  [171, '田旋花', 'Convolvulus arvensis', '旋花科', '旋花属'],
  [172, '菟丝子', 'Cuscuta chinensis', '旋花科', '菟丝子属'],
  [173, '斑种草', 'Bothriospermum chinense', '紫草科', '斑种草属'],
  [174, '枸杞', 'Lycium chinense', '茄科', '枸杞属'],
  [175, '宁夏枸杞', 'Lycium barbarum', '茄科', '枸杞属'],
  [176, '龙葵', 'Solanum nigrum', '茄科', '茄属'],
  [177, '曼陀罗', 'Datura stramonium', '茄科', '曼陀罗属'],
  [178, '地笋', 'Lycopus lucidus', '唇形科', '地笋属'],
  [179, '活血丹', 'Glechoma longituba', '唇形科', '活血丹属'],
  [180, '荔枝草', 'Salvia plebeia', '唇形科', '鼠尾草属'],
  [181, '林荫鼠尾草', 'Salvia nemorosa', '唇形科', '鼠尾草属'],
  [182, '夏至草', 'Lagopsis supina', '唇形科', '夏至草属'],
  [183, '益母草', 'Leonurus japonicus', '唇形科', '益母草属'],
  [184, '白花泡桐', 'Paulownia fortunei', '泡桐科', '泡桐属'],
  [185, '阿拉伯婆婆纳', 'Veronica persica', '车前科', '婆婆纳属'],
  [186, '北美车前', 'Plantago virginica', '车前科', '车前属'],
  [187, '大车前', 'Plantago major', '车前科', '车前属'],
  [188, '长叶车前', 'Plantago lanceolata', '车前科', '车前属'],
  [189, '地黄', 'Rehmannia glutinosa', '玄参科', '地黄属'],
  [190, '厚萼凌霄', 'Campsis radicans', '紫葳科', '凌霄属'],
  [191, '桔梗', 'Platycodon grandiflorus', '桔梗科', '桔梗属'],
  [192, '艾', 'Artemisia argyi', '菊科', '蒿属'],
  [193, '黄花蒿', 'Artemisia annua', '菊科', '蒿属'],
  [194, '南牡蒿', 'Artemisia eriopoda', '菊科', '蒿属'],
  [195, '五月艾', 'Artemisia indica', '菊科', '蒿属'],
  [196, '野艾蒿', 'Artemisia lavandulifolia', '菊科', '蒿属'],
  [197, '茵陈蒿', 'Artemisia capillaris', '菊科', '蒿属'],
  [198, '滨菊', 'Leucanthemum vulgare', '菊科', '滨菊属'],
  [199, '苍耳', 'Xanthium strumarium', '菊科', '苍耳属'],
  [200, '刺苍耳', 'Xanthium spinosum', '菊科', '苍耳属'],
  [201, '翅果菊', 'Pterocypsela indica', '菊科', '翅果菊属'],
  [202, '刺儿菜', 'Cirsium setosum', '菊科', '蓟属'],
  [203, '大蓟', 'Cirsium japonicum', '菊科', '蓟属'],
  [204, '粗毛牛膝菊', 'Galinsoga quadriradiata', '菊科', '牛膝菊属'],
  [205, '大狼耙草', 'Bidens frondosa', '菊科', '鬼针草属'],
  [206, '鬼针草', 'Bidens pilosa', '菊科', '鬼针草属'],
  [207, '婆婆针', 'Bidens bipinnata', '菊科', '鬼针草属'],
  [208, '飞蓬', 'Erigeron acer', '菊科', '飞蓬属'],
  [209, '一年蓬', 'Erigeron annuus', '菊科', '飞蓬属'],
  [210, '黑心金光菊', 'Rudbeckia hirta', '菊科', '金光菊属'],
  [211, '还阳参', 'Crepis crocea', '菊科', '还阳参属'],
  [212, '戟叶火绒草', 'Leontopodium dedekensii', '菊科', '火绒草属'],
  [213, '尖裂假还阳参', 'Crepidiastrum sonchifolium', '菊科', '假还阳参属'],
  [214, '金鸡菊', 'Coreopsis basalis', '菊科', '金鸡菊属'],
  [215, '菊蒿', 'Tanacetum vulgare', '菊科', '菊蒿属'],
  [216, '苣荬菜', 'Sonchus wightianus', '菊科', '苦苣菜属'],
  [217, '苦苣菜', 'Sonchus oleraceus', '菊科', '苦苣菜属'],
  [218, '续断菊', 'Sonchus asper', '菊科', '苦苣菜属'],
  [219, '苦荬菜', 'Ixeridium sonchifolium', '菊科', '苦荬菜属'],
  [220, '小苦荬', 'Ixeridium dentatum', '菊科', '苦荬菜属'],
  [221, '中华苦荬菜', 'Ixeridium chinense', '菊科', '苦荬菜属'],
  [222, '鳢肠', 'Eclipta prostrata', '菊科', '鳢肠属'],
  [223, '泥胡菜', 'Hemisteptia lyrata', '菊科', '泥胡菜属'],
  [224, '蒲公英', 'Taraxacum mongolicum', '菊科', '蒲公英属'],
  [225, '药用蒲公英', 'Taraxacum officinale', '菊科', '蒲公英属'],
  [226, '赛菊芋', 'Heliopsis helianthoides', '菊科', '赛菊芋属'],
  [227, '松果菊', 'Echinacea purpurea', '菊科', '松果菊属'],
  [228, '苏门白酒草', 'Conyza sumatrensis', '菊科', '白酒草属'],
  [229, '香丝草', 'Conyza bonariensis', '菊科', '白酒草属'],
  [230, '小蓬草', 'Conyza canadensis', '菊科', '白酒草属'],
  [231, '豚草', 'Ambrosia artemisiifolia', '菊科', '豚草属'],
  [232, '野莴苣', 'Lactuca serriola', '菊科', '莴苣属'],
  [233, '黄鹌菜', 'Youngia japonica', '菊科', '黄鹌菜属'],
  [234, '野菊', 'Chrysanthemum indicum', '菊科', '菊属'],
  [235, '旋覆花', 'Inula japonica', '菊科', '旋覆花属'],
  [236, '紫菀', 'Aster tataricus', '菊科', '紫菀属'],
  [237, '钻叶紫菀', 'Aster subulatus', '菊科', '紫菀属'],
  [238, '忍冬', 'Lonicera japonica', '忍冬科', '忍冬属'],
  [239, '圆果毛核木', 'Symphoricarpos orbiculatus', '忍冬科', '毛核木属'],
  [240, '早开堇菜', 'Viola prionantha', '堇菜科', '堇菜属'],
  [241, '紫花地丁', 'Viola philippica', '堇菜科', '堇菜属'],
];

export interface PlantRecord {
  id: number;
  name_cn: string;
  name_latin: string;
  family: string;
  genus: string;
  image_url: string;
  description: string;
  wikipedia_url: string;
  is_native: boolean;
  is_invasive: boolean;
  life_form: string;
  habitat: string;
  location: string;
  survey_date: string;
  created_at: string;
}

export const mockPlants: PlantRecord[] = rawData.map(([id, name_cn, name_latin, family, genus]) => {
  const month = ((id - 1) % 12) + 1;
  const day = ((id * 7) % 28) + 1;
  return {
    id,
    name_cn,
    name_latin,
    family,
    genus,
    image_url: '',
    description: `${name_cn}（${name_latin}），${family}${genus}植物，黄河流域河南段自生植物。`,
    wikipedia_url: `https://en.wikipedia.org/wiki/${encodeURIComponent(name_latin)}`,
    is_native: isNative(name_cn),
    is_invasive: isInvasive(name_cn),
    life_form: getLifeForm(family),
    habitat: habitats[id % habitats.length],
    location: locations[id % locations.length],
    survey_date: `2024-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    created_at: new Date(Date.now() - id * 3600000).toISOString(),
  };
});

export const mockStats = {
  total_records: mockPlants.length,
  total_families: new Set(mockPlants.map(p => p.family)).size,
  total_genera: new Set(mockPlants.map(p => p.genus)).size,
  native_species: mockPlants.filter(p => p.is_native).length,
  exotic_species: mockPlants.filter(p => !p.is_native).length,
  invasive_species: mockPlants.filter(p => p.is_invasive).length,
};

export const mockFamilies = (() => {
  const familyMap: Record<string, { family: string; count: number; genera: Set<string> }> = {};
  mockPlants.forEach(p => {
    if (!familyMap[p.family]) {
      familyMap[p.family] = { family: p.family, count: 0, genera: new Set() };
    }
    familyMap[p.family].count++;
    familyMap[p.family].genera.add(p.genus);
  });
  return Object.values(familyMap)
    .map(f => ({ family: f.family, count: f.count, genus_count: f.genera.size }))
    .sort((a, b) => b.count - a.count);
})();
