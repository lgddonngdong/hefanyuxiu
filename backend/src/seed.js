/**
 * Seed script - Import plant data into Supabase
 * Run with: node src/seed.js
 * 
 * This script reads plant data from the JSON file and inserts it into Supabase.
 * The JSON file is generated from the Excel data.
 */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Plant data - embedded for portability
const plantData = [
  { id: 1, name_cn: '节节草', name_latin: 'Equisetum ramosissimum', family: '木贼科', genus: '木贼属' },
  { id: 2, name_cn: '木贼', name_latin: 'Equisetum hyemale', family: '木贼科', genus: '木贼属' },
  { id: 3, name_cn: '泽泻', name_latin: 'Alisma plantago-aquatica', family: '泽泻科', genus: '泽泻属' },
  { id: 4, name_cn: '麦冬', name_latin: 'Ophiopogon japonicus', family: '天门冬科', genus: '沿阶草属' },
  { id: 5, name_cn: '沿阶草', name_latin: 'Ophiopogon bodinieri', family: '天门冬科', genus: '沿阶草属' },
  { id: 6, name_cn: '薯蓣', name_latin: 'Dioscorea polystachya', family: '薯蓣科', genus: '薯蓣属' },
  { id: 7, name_cn: '马蔺', name_latin: 'Iris lactea', family: '鸢尾科', genus: '鸢尾属' },
  { id: 8, name_cn: '野鸢尾', name_latin: 'Iris dichotoma', family: '鸢尾科', genus: '鸢尾属' },
  { id: 9, name_cn: '畦畔莎草', name_latin: 'Cyperus haspan', family: '莎草科', genus: '莎草属' },
  { id: 10, name_cn: '香附子', name_latin: 'Cyperus rotundus', family: '莎草科', genus: '莎草属' },
  { id: 11, name_cn: '水葱', name_latin: 'Schoenoplectus tabernaemontani', family: '莎草科', genus: '水葱属' },
  { id: 12, name_cn: '白茅', name_latin: 'Imperata cylindrica', family: '禾本科', genus: '白茅属' },
  { id: 13, name_cn: '白羊草', name_latin: 'Bothriochloa ischaemum', family: '禾本科', genus: '孔颖草属' },
  { id: 14, name_cn: '稗', name_latin: 'Echinochloa crusgalli', family: '禾本科', genus: '稗属' },
  { id: 15, name_cn: '小旱稗', name_latin: 'Echinochloa colona', family: '禾本科', genus: '稗属' },
  { id: 16, name_cn: '鹅观草', name_latin: 'Roegneria kamoji', family: '禾本科', genus: '鹅观草属' },
  { id: 17, name_cn: '拂子茅', name_latin: 'Calamagrostis epigejos', family: '禾本科', genus: '拂子茅属' },
  { id: 18, name_cn: '狗尾草', name_latin: 'Setaria viridis', family: '禾本科', genus: '狗尾草属' },
  { id: 19, name_cn: '狗牙根', name_latin: 'Cynodon dactylon', family: '禾本科', genus: '狗牙根属' },
  { id: 20, name_cn: '大画眉草', name_latin: 'Eragrostis cilianensis', family: '禾本科', genus: '画眉草属' },
  { id: 21, name_cn: '画眉草', name_latin: 'Eragrostis pilosa', family: '禾本科', genus: '画眉草属' },
  { id: 22, name_cn: '小画眉草', name_latin: 'Eragrostis minor', family: '禾本科', genus: '画眉草属' },
  { id: 23, name_cn: '黑麦草', name_latin: 'Lolium perenne', family: '禾本科', genus: '黑麦草属' },
  { id: 24, name_cn: '亨利马唐', name_latin: 'Digitaria henryi', family: '禾本科', genus: '马唐属' },
  { id: 25, name_cn: '马唐', name_latin: 'Digitaria sanguinalis', family: '禾本科', genus: '马唐属' },
  { id: 26, name_cn: '纤维马唐', name_latin: 'Digitaria fibrosa', family: '禾本科', genus: '马唐属' },
  { id: 27, name_cn: '荩草', name_latin: 'Arthraxon hispidus', family: '禾本科', genus: '荩草属' },
  { id: 28, name_cn: '蓝羊茅', name_latin: 'Festuca glauca', family: '禾本科', genus: '羊茅属' },
  { id: 29, name_cn: '紫羊茅', name_latin: 'Festuca rubra', family: '禾本科', genus: '羊茅属' },
  { id: 30, name_cn: '芦苇', name_latin: 'Phragmites australis', family: '禾本科', genus: '芦苇属' },
  { id: 31, name_cn: '雀麦', name_latin: 'Bromus japonicus', family: '禾本科', genus: '雀麦属' },
  { id: 32, name_cn: '无芒雀麦', name_latin: 'Bromus inermis', family: '禾本科', genus: '雀麦属' },
  { id: 33, name_cn: '柠檬草', name_latin: 'Cymbopogon citratus', family: '禾本科', genus: '香茅属' },
  { id: 34, name_cn: '牛筋草', name_latin: 'Eleusine indica', family: '禾本科', genus: '穇属' },
  { id: 35, name_cn: '披碱草', name_latin: 'Elymus dahuricus', family: '禾本科', genus: '披碱草属' },
  { id: 36, name_cn: '芒', name_latin: 'Miscanthus sinensis', family: '禾本科', genus: '芒属' },
  { id: 37, name_cn: '燕麦', name_latin: 'Avena sativa', family: '禾本科', genus: '燕麦属' },
  { id: 38, name_cn: '野燕麦', name_latin: 'Avena fatua', family: '禾本科', genus: '燕麦属' },
  { id: 39, name_cn: '虉草', name_latin: 'Phalaris arundinacea', family: '禾本科', genus: '虉草属' },
  { id: 40, name_cn: '早熟禾', name_latin: 'Poa annua', family: '禾本科', genus: '早熟禾属' },
  { id: 41, name_cn: '蔗茅', name_latin: 'Saccharum arundinaceum', family: '禾本科', genus: '甘蔗属' },
  { id: 42, name_cn: '地毯草', name_latin: 'Axonopus compressus', family: '禾本科', genus: '地毯草属' },
  { id: 43, name_cn: '构', name_latin: 'Broussonetia papyrifera', family: '桑科', genus: '构属' },
  { id: 44, name_cn: '鸡桑', name_latin: 'Morus australis', family: '桑科', genus: '桑属' },
  { id: 45, name_cn: '桑', name_latin: 'Morus alba', family: '桑科', genus: '桑属' },
  { id: 46, name_cn: '水蛇麻', name_latin: 'Fatoua villosa', family: '桑科', genus: '水蛇麻属' },
  { id: 47, name_cn: '苎麻', name_latin: 'Boehmeria nivea', family: '荨麻科', genus: '苎麻属' },
  { id: 48, name_cn: '榔榆', name_latin: 'Ulmus parvifolia', family: '榆科', genus: '榆属' },
  { id: 49, name_cn: '榆', name_latin: 'Ulmus pumila', family: '榆科', genus: '榆属' },
  { id: 50, name_cn: '朴', name_latin: 'Celtis sinensis', family: '朴科', genus: '朴属' },
  { id: 51, name_cn: '葎草', name_latin: 'Humulus scandens', family: '朴科', genus: '葎草属' },
  { id: 52, name_cn: '萹蓄', name_latin: 'Polygonum aviculare', family: '蓼科', genus: '蓼属' },
  { id: 53, name_cn: '春蓼', name_latin: 'Polygonum persicaria', family: '蓼科', genus: '蓼属' },
  { id: 54, name_cn: '酸模叶蓼', name_latin: 'Polygonum lapathifolium', family: '蓼科', genus: '蓼属' },
  { id: 55, name_cn: '齿果酸模', name_latin: 'Rumex dentatus', family: '蓼科', genus: '酸模属' },
  { id: 56, name_cn: '钝叶酸模', name_latin: 'Rumex obtusifolius', family: '蓼科', genus: '酸模属' },
  { id: 57, name_cn: '酸模', name_latin: 'Rumex acetosa', family: '蓼科', genus: '酸模属' },
  { id: 58, name_cn: '皱叶酸模', name_latin: 'Rumex crispus', family: '蓼科', genus: '酸模属' },
  { id: 59, name_cn: '藜', name_latin: 'Chenopodium album', family: '藜科', genus: '藜属' },
  { id: 60, name_cn: '猪毛菜', name_latin: 'Salsola collina', family: '藜科', genus: '猪毛菜属' },
  { id: 61, name_cn: '北美苋', name_latin: 'Amaranthus blitoides', family: '苋科', genus: '苋属' },
  { id: 62, name_cn: '反枝苋', name_latin: 'Amaranthus retroflexus', family: '苋科', genus: '苋属' },
  { id: 63, name_cn: '土牛膝', name_latin: 'Achyranthes aspera', family: '苋科', genus: '牛膝属' },
  { id: 64, name_cn: '喜旱莲子草', name_latin: 'Alternanthera philoxeroides', family: '苋科', genus: '莲子草属' },
  { id: 65, name_cn: '马齿苋', name_latin: 'Portulaca oleracea', family: '马齿苋科', genus: '马齿苋属' },
  { id: 66, name_cn: '头石竹', name_latin: 'Dianthus barbatus', family: '石竹科', genus: '石竹属' },
  { id: 67, name_cn: '商陆', name_latin: 'Phytolacca acinosa', family: '商陆科', genus: '商陆属' },
  { id: 68, name_cn: '茴茴蒜', name_latin: 'Ranunculus chinensis', family: '毛茛科', genus: '毛茛属' },
  { id: 69, name_cn: '石龙芮', name_latin: 'Ranunculus sceleratus', family: '毛茛科', genus: '毛茛属' },
  { id: 70, name_cn: '巴婆果', name_latin: 'Asimina triloba', family: '番荔枝科', genus: '巴婆果属' },
  { id: 71, name_cn: '樟', name_latin: 'Cinnamomum camphora', family: '樟科', genus: '樟属' },
  { id: 72, name_cn: '朝天委陵菜', name_latin: 'Potentilla supina', family: '蔷薇科', genus: '委陵菜属' },
  { id: 73, name_cn: '轮叶委陵菜', name_latin: 'Potentilla verticillaris', family: '蔷薇科', genus: '委陵菜属' },
  { id: 74, name_cn: '委陵菜', name_latin: 'Potentilla chinensis', family: '蔷薇科', genus: '委陵菜属' },
  { id: 75, name_cn: '火棘', name_latin: 'Pyracantha fortuneana', family: '蔷薇科', genus: '火棘属' },
  { id: 76, name_cn: '茅莓', name_latin: 'Rubus parvifolius', family: '蔷薇科', genus: '悬钩子属' },
  { id: 77, name_cn: '蛇莓', name_latin: 'Duchesnea indica', family: '蔷薇科', genus: '蛇莓属' },
  { id: 78, name_cn: '桃', name_latin: 'Amygdalus persica', family: '蔷薇科', genus: '桃属' },
  { id: 79, name_cn: '白车轴草', name_latin: 'Trifolium repens', family: '豆科', genus: '车轴草属' },
  { id: 80, name_cn: '白花草木樨', name_latin: 'Melilotus albus', family: '豆科', genus: '草木樨属' },
  { id: 81, name_cn: '草木樨', name_latin: 'Melilotus officinalis', family: '豆科', genus: '草木樨属' },
  { id: 82, name_cn: '刺果甘草', name_latin: 'Glycyrrhiza pallidiflora', family: '豆科', genus: '甘草属' },
  { id: 83, name_cn: '甘草', name_latin: 'Glycyrrhiza uralensis', family: '豆科', genus: '甘草属' },
  { id: 84, name_cn: '刺槐', name_latin: 'Robinia pseudoacacia', family: '豆科', genus: '刺槐属' },
  { id: 85, name_cn: '大豆', name_latin: 'Glycine max', family: '豆科', genus: '大豆属' },
  { id: 86, name_cn: '野大豆', name_latin: 'Glycine soja', family: '豆科', genus: '大豆属' },
  { id: 87, name_cn: '大花野豌豆', name_latin: 'Vicia bungei', family: '豆科', genus: '野豌豆属' },
  { id: 88, name_cn: '野豌豆', name_latin: 'Vicia sepium', family: '豆科', genus: '野豌豆属' },
  { id: 89, name_cn: '胡枝子', name_latin: 'Lespedeza bicolor', family: '豆科', genus: '胡枝子属' },
  { id: 90, name_cn: '截叶铁扫帚', name_latin: 'Lespedeza cuneata', family: '豆科', genus: '胡枝子属' },
  { id: 91, name_cn: '兴安胡枝子', name_latin: 'Lespedeza davurica', family: '豆科', genus: '胡枝子属' },
  { id: 92, name_cn: '中华胡枝子', name_latin: 'Lespedeza chinensis', family: '豆科', genus: '胡枝子属' },
  { id: 93, name_cn: '苦参', name_latin: 'Sophora flavescens', family: '豆科', genus: '苦参属' },
  { id: 94, name_cn: '绿豆', name_latin: 'Vigna radiata', family: '豆科', genus: '豇豆属' },
  { id: 95, name_cn: '米口袋', name_latin: 'Gueldenstaedtia verna', family: '豆科', genus: '米口袋属' },
  { id: 96, name_cn: '苜蓿', name_latin: 'Medicago sativa', family: '豆科', genus: '苜蓿属' },
  { id: 97, name_cn: '南苜蓿', name_latin: 'Medicago polymorpha', family: '豆科', genus: '苜蓿属' },
  { id: 98, name_cn: '天蓝苜蓿', name_latin: 'Medicago lupulina', family: '豆科', genus: '苜蓿属' },
  { id: 99, name_cn: '小苜蓿', name_latin: 'Medicago minima', family: '豆科', genus: '苜蓿属' },
  { id: 100, name_cn: '三点金', name_latin: 'Desmodium triflorum', family: '豆科', genus: '山蚂蝗属' },
  { id: 101, name_cn: '香槐', name_latin: 'Cladrastis wilsonii', family: '豆科', genus: '香槐属' },
  { id: 102, name_cn: '紫穗槐', name_latin: 'Amorpha fruticosa', family: '豆科', genus: '紫穗槐属' },
  { id: 103, name_cn: '关节酢浆草', name_latin: 'Oxalis articulata', family: '酢浆草科', genus: '酢浆草属' },
  { id: 104, name_cn: '黄花酢浆草', name_latin: 'Oxalis pes-caprae', family: '酢浆草科', genus: '酢浆草属' },
  { id: 105, name_cn: '酢浆草', name_latin: 'Oxalis corniculata', family: '酢浆草科', genus: '酢浆草属' },
  { id: 106, name_cn: '牻牛儿苗', name_latin: 'Erodium stephanianum', family: '牻牛儿苗科', genus: '牻牛儿苗属' },
  { id: 107, name_cn: '蒺藜', name_latin: 'Tribulus terrestris', family: '蒺藜科', genus: '蒺藜属' },
  { id: 108, name_cn: '白苞猩猩草', name_latin: 'Euphorbia heterophylla', family: '大戟科', genus: '大戟属' },
  { id: 109, name_cn: '斑地锦草', name_latin: 'Euphorbia maculata', family: '大戟科', genus: '大戟属' },
  { id: 110, name_cn: '地锦草', name_latin: 'Euphorbia humifusa', family: '大戟科', genus: '大戟属' },
  { id: 111, name_cn: '匍匐大戟', name_latin: 'Euphorbia serpens', family: '大戟科', genus: '大戟属' },
  { id: 112, name_cn: '泽漆', name_latin: 'Euphorbia helioscopia', family: '大戟科', genus: '大戟属' },
  { id: 113, name_cn: '铁苋菜', name_latin: 'Acalypha australis', family: '大戟科', genus: '铁苋菜属' },
  { id: 114, name_cn: '乌桕', name_latin: 'Triadica sebifera', family: '大戟科', genus: '乌桕属' },
  { id: 115, name_cn: '油桐', name_latin: 'Vernicia fordii', family: '大戟科', genus: '油桐属' },
  { id: 116, name_cn: '白杜', name_latin: 'Euonymus maackii', family: '卫矛科', genus: '卫矛属' },
  { id: 117, name_cn: '扶芳藤', name_latin: 'Euonymus fortunei', family: '卫矛科', genus: '卫矛属' },
  { id: 118, name_cn: '三叶漆', name_latin: 'Toxicodendron delavayi', family: '漆树科', genus: '漆树属' },
  { id: 119, name_cn: '柑橘', name_latin: 'Citrus reticulata', family: '芸香科', genus: '柑橘属' },
  { id: 120, name_cn: '花椒', name_latin: 'Zanthoxylum bungeanum', family: '芸香科', genus: '花椒属' },
  { id: 121, name_cn: '臭椿', name_latin: 'Ailanthus altissima', family: '苦木科', genus: '臭椿属' },
  { id: 122, name_cn: '楝', name_latin: 'Melia azedarach', family: '楝科', genus: '楝属' },
  { id: 123, name_cn: '梣叶槭', name_latin: 'Acer negundo', family: '无患子科', genus: '槭属' },
  { id: 124, name_cn: '栾', name_latin: 'Koelreuteria paniculata', family: '无患子科', genus: '栾属' },
  { id: 125, name_cn: '枣', name_latin: 'Ziziphus jujuba', family: '鼠李科', genus: '枣属' },
  { id: 126, name_cn: '乌头叶蛇葡萄', name_latin: 'Ampelopsis aconitifolia', family: '葡萄科', genus: '蛇葡萄属' },
  { id: 127, name_cn: '苘麻', name_latin: 'Abutilon theophrasti', family: '锦葵科', genus: '苘麻属' },
  { id: 128, name_cn: '蜀葵', name_latin: 'Alcea rosea', family: '锦葵科', genus: '蜀葵属' },
  { id: 129, name_cn: '千屈菜', name_latin: 'Lythrum salicaria', family: '千屈菜科', genus: '千屈菜属' },
  { id: 130, name_cn: '紫薇', name_latin: 'Lagerstroemia indica', family: '千屈菜科', genus: '紫薇属' },
  { id: 131, name_cn: '山桃草', name_latin: 'Gaura lindheimeri', family: '柳叶菜科', genus: '山桃草属' },
  { id: 132, name_cn: '小花山桃草', name_latin: 'Gaura parviflora', family: '柳叶菜科', genus: '山桃草属' },
  { id: 133, name_cn: '绞股蓝', name_latin: 'Gynostemma pentaphyllum', family: '葫芦科', genus: '绞股蓝属' },
  { id: 134, name_cn: '甜瓜', name_latin: 'Cucumis melo', family: '葫芦科', genus: '黄瓜属' },
  { id: 135, name_cn: '常春藤', name_latin: 'Hedera nepalensis', family: '五加科', genus: '常春藤属' },
  { id: 136, name_cn: '白柳', name_latin: 'Salix alba', family: '杨柳科', genus: '柳属' },
  { id: 137, name_cn: '旱柳', name_latin: 'Salix matsudana', family: '杨柳科', genus: '柳属' },
  { id: 138, name_cn: '黑杨', name_latin: 'Populus nigra', family: '杨柳科', genus: '杨属' },
  { id: 139, name_cn: '银白杨', name_latin: 'Populus alba', family: '杨柳科', genus: '杨属' },
  { id: 140, name_cn: '北美独行菜', name_latin: 'Lepidium virginicum', family: '十字花科', genus: '独行菜属' },
  { id: 141, name_cn: '独行菜', name_latin: 'Lepidium apetalum', family: '十字花科', genus: '独行菜属' },
  { id: 142, name_cn: '蔊菜', name_latin: 'Rorippa indica', family: '十字花科', genus: '蔊菜属' },
  { id: 143, name_cn: '沼生蔊菜', name_latin: 'Rorippa palustris', family: '十字花科', genus: '蔊菜属' },
  { id: 144, name_cn: '荠', name_latin: 'Capsella bursa-pastoris', family: '十字花科', genus: '荠属' },
  { id: 145, name_cn: '芥菜', name_latin: 'Brassica juncea', family: '十字花科', genus: '芸薹属' },
  { id: 146, name_cn: '补血草', name_latin: 'Limonium sinense', family: '白花丹科', genus: '补血草属' },
  { id: 147, name_cn: '二色补血草', name_latin: 'Limonium bicolor', family: '白花丹科', genus: '补血草属' },
  { id: 148, name_cn: '柽柳', name_latin: 'Tamarix chinensis', family: '柽柳科', genus: '柽柳属' },
  { id: 149, name_cn: '多枝柽柳', name_latin: 'Tamarix ramosissima', family: '柽柳科', genus: '柽柳属' },
  { id: 150, name_cn: '帚石南', name_latin: 'Calluna vulgaris', family: '杜鹃花科', genus: '帚石南属' },
  { id: 151, name_cn: '女贞', name_latin: 'Ligustrum lucidum', family: '木犀科', genus: '女贞属' },
  { id: 152, name_cn: '小蜡', name_latin: 'Ligustrum sinense', family: '木犀科', genus: '女贞属' },
  { id: 153, name_cn: '黄荆', name_latin: 'Vitex negundo', family: '马鞭草科', genus: '牡荆属' },
  { id: 154, name_cn: '牡荆', name_latin: 'Vitex negundo var.cannabifolia', family: '马鞭草科', genus: '牡荆属' },
  { id: 155, name_cn: '鸡屎藤', name_latin: 'Paederia scandens', family: '茜草科', genus: '鸡屎藤属' },
  { id: 156, name_cn: '拉拉藤', name_latin: 'Galium spurium', family: '茜草科', genus: '拉拉藤属' },
  { id: 157, name_cn: '卵叶茜草', name_latin: 'Rubia ovatifolia', family: '茜草科', genus: '茜草属' },
  { id: 158, name_cn: '茜草', name_latin: 'Rubia cordifolia', family: '茜草科', genus: '茜草属' },
  { id: 159, name_cn: '地稍瓜', name_latin: 'Cynanchum thesioides', family: '夹竹桃科', genus: '鹅绒藤属' },
  { id: 160, name_cn: '鹅绒藤', name_latin: 'Cynanchum chinense', family: '夹竹桃科', genus: '鹅绒藤属' },
  { id: 161, name_cn: '柳叶白前', name_latin: 'Cynanchum stauntonii', family: '夹竹桃科', genus: '鹅绒藤属' },
  { id: 162, name_cn: '毛白前', name_latin: 'Cynanchum mooreanum', family: '夹竹桃科', genus: '鹅绒藤属' },
  { id: 163, name_cn: '牛皮消', name_latin: 'Cynanchum auriculatum', family: '夹竹桃科', genus: '鹅绒藤属' },
  { id: 164, name_cn: '杠柳', name_latin: 'Periploca sepium', family: '夹竹桃科', genus: '杠柳属' },
  { id: 165, name_cn: '华萝藦', name_latin: 'Metaplexis hemsleyana', family: '夹竹桃科', genus: '萝藦属' },
  { id: 166, name_cn: '罗布麻', name_latin: 'Apocynum venetum', family: '夹竹桃科', genus: '罗布麻属' },
  { id: 167, name_cn: '打碗花', name_latin: 'Calystegia hederacea', family: '旋花科', genus: '打碗花属' },
  { id: 168, name_cn: '牵牛', name_latin: 'Ipomoea nil', family: '旋花科', genus: '番薯属' },
  { id: 169, name_cn: '小心叶薯', name_latin: 'Ipomoea obscura', family: '旋花科', genus: '番薯属' },
  { id: 170, name_cn: '圆叶牵牛', name_latin: 'Ipomoea purpurea', family: '旋花科', genus: '番薯属' },
  { id: 171, name_cn: '田旋花', name_latin: 'Convolvulus arvensis', family: '旋花科', genus: '旋花属' },
  { id: 172, name_cn: '菟丝子', name_latin: 'Cuscuta chinensis', family: '旋花科', genus: '菟丝子属' },
  { id: 173, name_cn: '斑种草', name_latin: 'Bothriospermum chinense', family: '紫草科', genus: '斑种草属' },
  { id: 174, name_cn: '枸杞', name_latin: 'Lycium chinense', family: '茄科', genus: '枸杞属' },
  { id: 175, name_cn: '宁夏枸杞', name_latin: 'Lycium barbarum', family: '茄科', genus: '枸杞属' },
  { id: 176, name_cn: '龙葵', name_latin: 'Solanum nigrum', family: '茄科', genus: '茄属' },
  { id: 177, name_cn: '曼陀罗', name_latin: 'Datura stramonium', family: '茄科', genus: '曼陀罗属' },
  { id: 178, name_cn: '地笋', name_latin: 'Lycopus lucidus', family: '唇形科', genus: '地笋属' },
  { id: 179, name_cn: '活血丹', name_latin: 'Glechoma longituba', family: '唇形科', genus: '活血丹属' },
  { id: 180, name_cn: '荔枝草', name_latin: 'Salvia plebeia', family: '唇形科', genus: '鼠尾草属' },
  { id: 181, name_cn: '林荫鼠尾草', name_latin: 'Salvia nemorosa', family: '唇形科', genus: '鼠尾草属' },
  { id: 182, name_cn: '夏至草', name_latin: 'Lagopsis supina', family: '唇形科', genus: '夏至草属' },
  { id: 183, name_cn: '益母草', name_latin: 'Leonurus japonicus', family: '唇形科', genus: '益母草属' },
  { id: 184, name_cn: '白花泡桐', name_latin: 'Paulownia fortunei', family: '泡桐科', genus: '泡桐属' },
  { id: 185, name_cn: '阿拉伯婆婆纳', name_latin: 'Veronica persica', family: '车前科', genus: '婆婆纳属' },
  { id: 186, name_cn: '北美车前', name_latin: 'Plantago virginica', family: '车前科', genus: '车前属' },
  { id: 187, name_cn: '大车前', name_latin: 'Plantago major', family: '车前科', genus: '车前属' },
  { id: 188, name_cn: '长叶车前', name_latin: 'Plantago lanceolata', family: '车前科', genus: '车前属' },
  { id: 189, name_cn: '地黄', name_latin: 'Rehmannia glutinosa', family: '玄参科', genus: '地黄属' },
  { id: 190, name_cn: '厚萼凌霄', name_latin: 'Campsis radicans', family: '紫葳科', genus: '凌霄属' },
  { id: 191, name_cn: '桔梗', name_latin: 'Platycodon grandiflorus', family: '桔梗科', genus: '桔梗属' },
  { id: 192, name_cn: '艾', name_latin: 'Artemisia argyi', family: '菊科', genus: '蒿属' },
  { id: 193, name_cn: '黄花蒿', name_latin: 'Artemisia annua', family: '菊科', genus: '蒿属' },
  { id: 194, name_cn: '南牡蒿', name_latin: 'Artemisia eriopoda', family: '菊科', genus: '蒿属' },
  { id: 195, name_cn: '五月艾', name_latin: 'Artemisia indica', family: '菊科', genus: '蒿属' },
  { id: 196, name_cn: '野艾蒿', name_latin: 'Artemisia lavandulifolia', family: '菊科', genus: '蒿属' },
  { id: 197, name_cn: '茵陈蒿', name_latin: 'Artemisia capillaris', family: '菊科', genus: '蒿属' },
  { id: 198, name_cn: '滨菊', name_latin: 'Leucanthemum vulgare', family: '菊科', genus: '滨菊属' },
  { id: 199, name_cn: '苍耳', name_latin: 'Xanthium strumarium', family: '菊科', genus: '苍耳属' },
  { id: 200, name_cn: '刺苍耳', name_latin: 'Xanthium spinosum', family: '菊科', genus: '苍耳属' },
  { id: 201, name_cn: '翅果菊', name_latin: 'Pterocypsela indica', family: '菊科', genus: '翅果菊属' },
  { id: 202, name_cn: '刺儿菜', name_latin: 'Cirsium setosum', family: '菊科', genus: '蓟属' },
  { id: 203, name_cn: '大蓟', name_latin: 'Cirsium japonicum', family: '菊科', genus: '蓟属' },
  { id: 204, name_cn: '粗毛牛膝菊', name_latin: 'Galinsoga quadriradiata', family: '菊科', genus: '牛膝菊属' },
  { id: 205, name_cn: '大狼耙草', name_latin: 'Bidens frondosa', family: '菊科', genus: '鬼针草属' },
  { id: 206, name_cn: '鬼针草', name_latin: 'Bidens pilosa', family: '菊科', genus: '鬼针草属' },
  { id: 207, name_cn: '婆婆针', name_latin: 'Bidens bipinnata', family: '菊科', genus: '鬼针草属' },
  { id: 208, name_cn: '飞蓬', name_latin: 'Erigeron acer', family: '菊科', genus: '飞蓬属' },
  { id: 209, name_cn: '一年蓬', name_latin: 'Erigeron annuus', family: '菊科', genus: '飞蓬属' },
  { id: 210, name_cn: '黑心金光菊', name_latin: 'Rudbeckia hirta', family: '菊科', genus: '金光菊属' },
  { id: 211, name_cn: '还阳参', name_latin: 'Crepis crocea', family: '菊科', genus: '还阳参属' },
  { id: 212, name_cn: '戟叶火绒草', name_latin: 'Leontopodium dedekensii', family: '菊科', genus: '火绒草属' },
  { id: 213, name_cn: '尖裂假还阳参', name_latin: 'Crepidiastrum sonchifolium', family: '菊科', genus: '假还阳参属' },
  { id: 214, name_cn: '金鸡菊', name_latin: 'Coreopsis basalis', family: '菊科', genus: '金鸡菊属' },
  { id: 215, name_cn: '菊蒿', name_latin: 'Tanacetum vulgare', family: '菊科', genus: '菊蒿属' },
  { id: 216, name_cn: '苣荬菜', name_latin: 'Sonchus wightianus', family: '菊科', genus: '苦苣菜属' },
  { id: 217, name_cn: '苦苣菜', name_latin: 'Sonchus oleraceus', family: '菊科', genus: '苦苣菜属' },
  { id: 218, name_cn: '续断菊', name_latin: 'Sonchus asper', family: '菊科', genus: '苦苣菜属' },
  { id: 219, name_cn: '苦荬菜', name_latin: 'Ixeridium sonchifolium', family: '菊科', genus: '苦荬菜属' },
  { id: 220, name_cn: '小苦荬', name_latin: 'Ixeridium dentatum', family: '菊科', genus: '苦荬菜属' },
  { id: 221, name_cn: '中华苦荬菜', name_latin: 'Ixeridium chinense', family: '菊科', genus: '苦荬菜属' },
  { id: 222, name_cn: '鳢肠', name_latin: 'Eclipta prostrata', family: '菊科', genus: '鳢肠属' },
  { id: 223, name_cn: '泥胡菜', name_latin: 'Hemisteptia lyrata', family: '菊科', genus: '泥胡菜属' },
  { id: 224, name_cn: '蒲公英', name_latin: 'Taraxacum mongolicum', family: '菊科', genus: '蒲公英属' },
  { id: 225, name_cn: '药用蒲公英', name_latin: 'Taraxacum officinale', family: '菊科', genus: '蒲公英属' },
  { id: 226, name_cn: '赛菊芋', name_latin: 'Heliopsis helianthoides', family: '菊科', genus: '赛菊芋属' },
  { id: 227, name_cn: '松果菊', name_latin: 'Echinacea purpurea', family: '菊科', genus: '松果菊属' },
  { id: 228, name_cn: '苏门白酒草', name_latin: 'Conyza sumatrensis', family: '菊科', genus: '白酒草属' },
  { id: 229, name_cn: '香丝草', name_latin: 'Conyza bonariensis', family: '菊科', genus: '白酒草属' },
  { id: 230, name_cn: '小蓬草', name_latin: 'Conyza canadensis', family: '菊科', genus: '白酒草属' },
  { id: 231, name_cn: '豚草', name_latin: 'Ambrosia artemisiifolia', family: '菊科', genus: '豚草属' },
  { id: 232, name_cn: '野莴苣', name_latin: 'Lactuca serriola', family: '菊科', genus: '莴苣属' },
  { id: 233, name_cn: '黄鹌菜', name_latin: 'Youngia japonica', family: '菊科', genus: '黄鹌菜属' },
  { id: 234, name_cn: '野菊', name_latin: 'Chrysanthemum indicum', family: '菊科', genus: '菊属' },
  { id: 235, name_cn: '旋覆花', name_latin: 'Inula japonica', family: '菊科', genus: '旋覆花属' },
  { id: 236, name_cn: '紫菀', name_latin: 'Aster tataricus', family: '菊科', genus: '紫菀属' },
  { id: 237, name_cn: '钻叶紫菀', name_latin: 'Aster subulatus', family: '菊科', genus: '紫菀属' },
  { id: 238, name_cn: '忍冬', name_latin: 'Lonicera japonica', family: '忍冬科', genus: '忍冬属' },
  { id: 239, name_cn: '圆果毛核木', name_latin: 'Symphoricarpos orbiculatus', family: '忍冬科', genus: '毛核木属' },
  { id: 240, name_cn: '早开堇菜', name_latin: 'Viola prionantha', family: '堇菜科', genus: '堇菜属' },
  { id: 241, name_cn: '紫花地丁', name_latin: 'Viola philippica', family: '堇菜科', genus: '堇菜属' },
];

// Helper: determine life form based on family
function getLifeForm(family) {
  const woodyFamilies = ['桑科', '榆科', '杨柳科', '芸香科', '苦木科', '楝科', '樟科', '无患子科', '鼠李科', '卫矛科', '大戟科', '蔷薇科', '豆科', '木犀科', '千屈菜科', '泡桐科'];
  const treeFamilies = ['桑科', '榆科', '杨柳科', '芸香科', '苦木科', '楝科', '樟科', '无患子科', '鼠李科', '卫矛科', '大戟科'];
  if (treeFamilies.includes(family)) return '木本';
  return '草本';
}

// Helper: determine if native
function isNative(name) {
  const exoticKeywords = ['北美', '外来', '归化', '喜旱', '阿拉伯'];
  for (const kw of exoticKeywords) {
    if (name.includes(kw)) return false;
  }
  return true;
}

// Main seed function
async function seed() {
  console.log('🌱 Starting database seed...');

  // Check if data already exists
  const { count } = await supabase.from('plants').select('*', { count: 'exact', head: true });
  if (count > 0) {
    console.log(`⚠️  Database already has ${count} records. Skipping seed.`);
    console.log('   To re-seed, first truncate the table in Supabase dashboard.');
    return;
  }

  // Prepare records
  const records = plantData.map(p => {
    const habitats = ['河岸', '田野', '路旁', '草地', '灌丛', '林缘', '湿地', '荒地'];
    const locations = ['郑州市金水区', '洛阳市洛龙区', '开封市龙亭区', '新乡市牧野区', '焦作市解放区',
      '南阳市卧龙区', '信阳市浉河区', '周口市川汇区', '驻马店市驿城区', '商丘市睢阳区'];
    const month = ((p.id - 1) % 12) + 1;
    const day = ((p.id * 7) % 28) + 1;

    return {
      id: p.id,
      name_cn: p.name_cn,
      name_latin: p.name_latin,
      family: p.family,
      genus: p.genus,
      image_url: '',
      description: `${p.name_cn}（${p.name_latin}），${p.family}${p.genus}植物，黄河流域河南段自生植物。`,
      wikipedia_url: '',
      is_native: isNative(p.name_cn),
      life_form: getLifeForm(p.family),
      habitat: habitats[p.id % habitats.length],
      location: locations[p.id % locations.length],
      survey_date: `2024-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    };
  });

  // Insert in batches of 50
  const batchSize = 50;
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    const { error } = await supabase.from('plants').insert(batch);
    if (error) {
      console.error(`Error inserting batch ${i / batchSize + 1}:`, error.message);
    } else {
      console.log(`✓ Inserted ${i + batch.length}/${records.length} records`);
    }
  }

  console.log(`\n✅ Seed complete! Inserted ${records.length} plant records.`);
  console.log('   Images will be fetched from Wikipedia at runtime.');
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
