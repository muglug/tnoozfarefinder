if (!Array.prototype.includes) {
  Array.prototype.includes = function(searchElement /*, fromIndex*/ ) {
    'use strict';
    var O = Object(this);
    var len = parseInt(O.length) || 0;
    if (len === 0) {
      return false;
    }
    var n = parseInt(arguments[1]) || 0;
    var k;
    if (n >= 0) {
      k = n;
    } else {
      k = len + n;
      if (k < 0) {k = 0;}
    }
    var currentElement;
    while (k < len) {
      currentElement = O[k];
      if (searchElement === currentElement ||
         (searchElement !== searchElement && currentElement !== currentElement)) {
        return true;
      }
      k++;
    }
    return false;
  };
}

var current_location = null,
	airport_locations = null,
	ip_request,
	airport_locations_request,
	nearest_airports_request,
	cheapest_flights_request,
	container_id = 'tnooz_flightfinder_overlay',
	results_container_id = 'tnooz_results_container';
	nearest_airports = null,
	flight_lookup_cache = {},
	noaa_map = 
{"Abu Dhabi, AE":"CITY:AE000001","Ajman, AE":"CITY:AE000002","Dubai, AE":"CITY:AE000003","Sharjah, AE":"CITY:AE000006","Kabul, AF":"CITY:AF000007","Kandahar, AF":"CITY:AF000008","Algiers, AG":"CITY:AG000001","Annaba, AG":"CITY:AG000002","Batna, AG":"CITY:AG000003","Bechar, AG":"CITY:AG000004","Bejaia, AG":"CITY:AG000005","Constantine, AG":"CITY:AG000006","Guelma, AG":"CITY:AG000007","Laghouat, AG":"CITY:AG000008","Medea, AG":"CITY:AG000009","Mostaganem, AG":"CITY:AG000010","Oran, AG":"CITY:AG000011","Oum el Bouaghi, AG":"CITY:AG000012","Saida, AG":"CITY:AG000013","Sidi-Bel-Abbes, AG":"CITY:AG000014","Skikda, AG":"CITY:AG000015","Tamanrasset, AG":"CITY:AG000016","Tlemcen, AG":"CITY:AG000017","Baku, AJ":"CITY:AJ000001","Naxcivian, AJ":"CITY:AJ000002","Durres, AL":"CITY:AL000001","Shkoder, AL":"CITY:AL000004","Tirana, AL":"CITY:AL000005","Yerevan, AM":"CITY:AM000001","Luanda, AO":"CITY:AO000005","Lubango, AO":"CITY:AO000006","Namibe, AO":"CITY:AO000008","Bahia Blanca, AR":"CITY:AR000001","Buenos Aires, AR":"CITY:AR000002","Catamarca, AR":"CITY:AR000003","Comodoro Rivadavia, AR":"CITY:AR000004","Cordoba, AR":"CITY:AR000005","Corrientes, AR":"CITY:AR000006","Formosa, AR":"CITY:AR000007","La Plata, AR":"CITY:AR000008","La Rioja, AR":"CITY:AR000009","Mendoza, AR":"CITY:AR000010","Neuquen, AR":"CITY:AR000011","Parana, AR":"CITY:AR000012","Posadas, AR":"CITY:AR000013","Resistencia, AR":"CITY:AR000014","Rio Gallegos, AR":"CITY:AR000015","Rosario, AR":"CITY:AR000016","Salta, AR":"CITY:AR000017","San Juan, AR":"CITY:AR000018","San Luis, AR":"CITY:AR000019","San Miguel De Tucuman, AR":"CITY:AR000020","Santa Rosa, AR":"CITY:AR000023","Santiago Del Estero, AR":"CITY:AR000024","Ushuaia, AR":"CITY:AR000025","Adelaide, AS":"CITY:AS000001","Brisbane, AS":"CITY:AS000002","Cairns, AS":"CITY:AS000003","Canberra, AS":"CITY:AS000004","Darwin, AS":"CITY:AS000005","Melbourne, AS":"CITY:AS000006","Newcastle, AS":"CITY:AS000007","Perth, AS":"CITY:AS000008","Rockhampton, AS":"CITY:AS000009","Sydney, AS":"CITY:AS000010","Townsville, AS":"CITY:AS000011","Graz, AU":"CITY:AU000001","Innsbruck, AU":"CITY:AU000002","Klagenfurt, AU":"CITY:AU000003","Salzburg, AU":"CITY:AU000005","Vienna, AU":"CITY:AU000006","Al-Muharraq, BA":"CITY:BA000001","Manama, BA":"CITY:BA000002","Bridgetown, BB":"CITY:BB000001","Francistown, BC":"CITY:BC000001","Gaborone, BC":"CITY:BC000002","Molepolole, BC":"CITY:BC000003","Brussels, BE":"CITY:BE000002","Gent, BE":"CITY:BE000003","Hasselt, BE":"CITY:BE000004","Liege, BE":"CITY:BE000005","Nassau, BF":"CITY:BF000001","Barisal, BG":"CITY:BG000001","Chittagong, BG":"CITY:BG000002","Dhaka, BG":"CITY:BG000003","Rajshahi, BG":"CITY:BG000005","Belize, BH":"CITY:BH000001","Sarajevo, BK":"CITY:BK000001","Cochabamba, BL":"CITY:BL000001","La Paz, BL":"CITY:BL000002","Oruro, BL":"CITY:BL000003","Potosi, BL":"CITY:BL000004","Santa Cruz de La Sierra, BL":"CITY:BL000005","Sucre, BL":"CITY:BL000006","Tarija, BL":"CITY:BL000007","Trinidad, BL":"CITY:BL000008","Mandalay, BM":"CITY:BM000003","Myitkyina, BM":"CITY:BM000005","Rangoon, BM":"CITY:BM000007","Sagaing, BM":"CITY:BM000008","Sittwe, BM":"CITY:BM000009","Abomey, BN":"CITY:BN000001","Cotonou, BN":"CITY:BN000002","Lokossa, BN":"CITY:BN000003","Natitingou, BN":"CITY:BN000004","Parakou, BN":"CITY:BN000005","Brest, BO":"CITY:BO000001","Homyel', BO":"CITY:BO000002","Hrodna, BO":"CITY:BO000003","Mahilyow, BO":"CITY:BO000004","Minsk, BO":"CITY:BO000005","Vitsyebsk, BO":"CITY:BO000006","Honiara, BP":"CITY:BP000001","Aracaju, BR":"CITY:BR000001","Belem, BR":"CITY:BR000002","Belo Horizonte, BR":"CITY:BR000003","Boa Vista, BR":"CITY:BR000004","Brasilia, BR":"CITY:BR000005","Campo Grande, BR":"CITY:BR000006","Cuiaba, BR":"CITY:BR000007","Curitiba, BR":"CITY:BR000008","Florianopolis, BR":"CITY:BR000009","Fortaleza, BR":"CITY:BR000010","Goiania, BR":"CITY:BR000011","Joao Pessoa, BR":"CITY:BR000012","Macapa, BR":"CITY:BR000013","Maceio, BR":"CITY:BR000014","Manaus, BR":"CITY:BR000015","Natal, BR":"CITY:BR000016","Niteroi, BR":"CITY:BR000017","Palmas, BR":"CITY:BR000018","Porto Alegre, BR":"CITY:BR000019","Porto Velho, BR":"CITY:BR000020","Recife, BR":"CITY:BR000021","Rio Branco, BR":"CITY:BR000022","Rio de Janeiro, BR":"CITY:BR000023","Salvador, BR":"CITY:BR000024","Santarem, BR":"CITY:BR000025","Santos, BR":"CITY:BR000026","Sao Luis, BR":"CITY:BR000027","Sao Paulo, BR":"CITY:BR000028","Teresina, BR":"CITY:BR000029","Vitoria, BR":"CITY:BR000030","Sofia, BU":"CITY:BU000002","Varna, BU":"CITY:BU000003","Bandar Seri Begawan, BX":"CITY:BX000001","Bujumbura, BY":"CITY:BY000001","Muyinga, BY":"CITY:BY000002","Calgary, CA":"CITY:CA000001","Edmonton, CA":"CITY:CA000002","Fredericton, CA":"CITY:CA000003","Halifax, CA":"CITY:CA000004","Montreal, CA":"CITY:CA000005","Ottawa, CA":"CITY:CA000006","Quebec, CA":"CITY:CA000007","Regina, CA":"CITY:CA000008","Saint John, CA":"CITY:CA000009","Saskatoon, CA":"CITY:CA000010","Toronto, CA":"CITY:CA000011","Vancouver, CA":"CITY:CA000012","Victoria, CA":"CITY:CA000013","Winnipeg, CA":"CITY:CA000014","Phnom Penh, CB":"CITY:CB000004","Abeche, CD":"CITY:CD000001","Moundou, CD":"CITY:CD000002","Ndjamena, CD":"CITY:CD000003","Sarh, CD":"CITY:CD000004","Colombo, CE":"CITY:CE000002","Trincomalee, CE":"CITY:CE000005","Brazzaville, CF":"CITY:CF000001","Loubomo, CF":"CITY:CF000002","Pointe Noire, CF":"CITY:CF000003","Bandundu, CG":"CITY:CG000001","Kananga, CG":"CITY:CG000002","Kinshasa, CG":"CITY:CG000003","Lumumbashi, CG":"CITY:CG000005","Matadi, CG":"CITY:CG000006","Mbandaka, CG":"CITY:CG000007","Mbuji-Mayi, CG":"CITY:CG000008","Beijing, CH":"CITY:CH000003","Changchun, CH":"CITY:CH000004","Changsha, CH":"CITY:CH000005","Chengdu, CH":"CITY:CH000006","Chongqing, CH":"CITY:CH000007","Dalian, CH":"CITY:CH000008","Fushun, CH":"CITY:CH000009","Fuzhou, CH":"CITY:CH000010","Guangzhou, CH":"CITY:CH000011","Guiyang, CH":"CITY:CH000012","Hangzhou, CH":"CITY:CH000013","Harbin, CH":"CITY:CH000014","Hefei, CH":"CITY:CH000015","Hong Kong, CH":"CITY:CH000016","Huhot, CH":"CITY:CH000017","Jinan, CH":"CITY:CH000019","Kashi, CH":"CITY:CH000020","Kunming, CH":"CITY:CH000021","Lanzhou, CH":"CITY:CH000022","Lhasa, CH":"CITY:CH000023","Macau, CH":"CITY:CH000025","Nanchang, CH":"CITY:CH000026","Nanjing, CH":"CITY:CH000027","Nanning, CH":"CITY:CH000028","Qingdao, CH":"CITY:CH000029","Qiqihar, CH":"CITY:CH000030","Shanghai, CH":"CITY:CH000031","Shenyang, CH":"CITY:CH000032","Shijiazhuang, CH":"CITY:CH000033","Taiyuan, CH":"CITY:CH000037","Tianjin, CH":"CITY:CH000039","Urumqi, CH":"CITY:CH000040","Wuhan, CH":"CITY:CH000041","Xi'an, CH":"CITY:CH000042","Xining, CH":"CITY:CH000043","Yinchuan, CH":"CITY:CH000044","Zhengzhou, CH":"CITY:CH000045","Antofagasta, CI":"CITY:CI000001","Concepcion, CI":"CITY:CI000002","Copiapo, CI":"CITY:CI000003","Coquimbo, CI":"CITY:CI000004","La Serena, CI":"CITY:CI000006","Puerto Montt, CI":"CITY:CI000007","Punta Arenas, CI":"CITY:CI000008","Santiago, CI":"CITY:CI000009","Temuco, CI":"CITY:CI000011","Bertoua, CM":"CITY:CM000003","Douala, CM":"CITY:CM000004","Garoua, CM":"CITY:CM000006","Maroua, CM":"CITY:CM000007","Ngaoundere, CM":"CITY:CM000008","Arauca, CO":"CITY:CO000001","Armenia, CO":"CITY:CO000002","Barranquilla, CO":"CITY:CO000003","Bogota, CO":"CITY:CO000004","Bucaramanga, CO":"CITY:CO000005","Cali, CO":"CITY:CO000006","Cartagena, CO":"CITY:CO000007","Cucuta, CO":"CITY:CO000008","Ibague, CO":"CITY:CO000010","Medellin, CO":"CITY:CO000012","Monteria, CO":"CITY:CO000013","Neiva, CO":"CITY:CO000014","Pasto, CO":"CITY:CO000015","Pereira, CO":"CITY:CO000016","Quibdo, CO":"CITY:CO000017","Riohacha, CO":"CITY:CO000018","San Andres, CO":"CITY:CO000019","Santa Marta, CO":"CITY:CO000020","Valledupar, CO":"CITY:CO000023","Villavicencio, CO":"CITY:CO000024","Puerto Limon, CS":"CITY:CS000001","San Jose, CS":"CITY:CS000002","Bangui, CT":"CITY:CT000001","Berberati, CT":"CITY:CT000002","Camaguey, CU":"CITY:CU000001","Havana, CU":"CITY:CU000005","Matanzas, CU":"CITY:CU000008","Praia, CV":"CITY:CV000001","Lemesos, CY":"CITY:CY000001","Nicosia, CY":"CITY:CY000002","Alborg, DA":"CITY:DA000001","Copenhagen, DA":"CITY:DA000003","Santiago, DR":"CITY:DR000008","Santo Domingo, DR":"CITY:DR000009","Babahoyo, EC":"CITY:EC000002","Loja, EC":"CITY:EC000006","Portoviejo, EC":"CITY:EC000008","Quito, EC":"CITY:EC000009","Al Ghurdaqah, EG":"CITY:EG000001","Alexandria, EG":"CITY:EG000002","Aswan, EG":"CITY:EG000003","Cairo, EG":"CITY:EG000005","Giza, EG":"CITY:EG000007","Ismailia, EG":"CITY:EG000008","Marsa Matruh, EG":"CITY:EG000009","Qena, EG":"CITY:EG000010","Suez, EG":"CITY:EG000012","Cork, EI":"CITY:EI000001","Dublin, EI":"CITY:EI000002","Galway, EI":"CITY:EI000003","Bata, EK":"CITY:EK000001","Malabo, EK":"CITY:EK000002","Tallinn, EN":"CITY:EN000001","Asmara, ER":"CITY:ER000001","Nueva San Salvador, ES":"CITY:ES000001","San Salvador, ES":"CITY:ES000002","Sonsonate, ES":"CITY:ES000004","Addis Ababa, ET":"CITY:ET000001","Arba Minch, ET":"CITY:ET000002","Awasa, ET":"CITY:ET000003","Debre Markos, ET":"CITY:ET000004","Dese, ET":"CITY:ET000005","Gonder, ET":"CITY:ET000006","Jima, ET":"CITY:ET000007","Brno, EZ":"CITY:EZ000001","Ostrava, EZ":"CITY:EZ000004","Prague, EZ":"CITY:EZ000006","Usti Nad Labem, EZ":"CITY:EZ000007","Cayenne, FG":"CITY:FG000001","Helsinki, FI":"CITY:FI000001","Joensuu, FI":"CITY:FI000002","Jyvaskyla, FI":"CITY:FI000003","Kuopio, FI":"CITY:FI000004","Oulu, FI":"CITY:FI000005","Turku, FI":"CITY:FI000006","Suva, FJ":"CITY:FJ000001","Ajaccio, FR":"CITY:FR000001","Amiens, FR":"CITY:FR000002","Besancon, FR":"CITY:FR000003","Brest, FR":"CITY:FR000005","Caen, FR":"CITY:FR000006","Clermont-Ferrand, FR":"CITY:FR000007","Dijon, FR":"CITY:FR000008","Le Havre, FR":"CITY:FR000009","Lille, FR":"CITY:FR000010","Limoges, FR":"CITY:FR000011","Lyon, FR":"CITY:FR000012","Marseille, FR":"CITY:FR000013","Montpellier, FR":"CITY:FR000014","Nancy, FR":"CITY:FR000015","Nantes, FR":"CITY:FR000016","Orleans, FR":"CITY:FR000017","Paris, FR":"CITY:FR000018","Poitiers, FR":"CITY:FR000019","Reims, FR":"CITY:FR000020","Rennes, FR":"CITY:FR000021","Rouen, FR":"CITY:FR000022","Strasbourg, FR":"CITY:FR000023","Toulouse, FR":"CITY:FR000024","Brikama, GA":"CITY:GA000001","Libreville, GB":"CITY:GB000001","Port Gentil, GB":"CITY:GB000002","Bat'umi, GG":"CITY:GG000001","Sokhumi, GG":"CITY:GG000002","T'Bilisi, GG":"CITY:GG000003","Accra, GH":"CITY:GH000001","Ho, GH":"CITY:GH000004","Koforidua, GH":"CITY:GH000005","Kumasi, GH":"CITY:GH000006","Sekondi, GH":"CITY:GH000007","Sunyani, GH":"CITY:GH000008","Tamale, GH":"CITY:GH000009","Wa, GH":"CITY:GH000010","Berlin, GM":"CITY:GM000001","Bonn, GM":"CITY:GM000002","Bremen, GM":"CITY:GM000003","Bremerhaven, GM":"CITY:GM000004","Cologne, GM":"CITY:GM000005","Dortmund, GM":"CITY:GM000006","Dresden, GM":"CITY:GM000007","Duisburg, GM":"CITY:GM000008","Dusseldorf, GM":"CITY:GM000009","Erfurt, GM":"CITY:GM000010","Essen, GM":"CITY:GM000011","Frankfurt, GM":"CITY:GM000012","Hamburg, GM":"CITY:GM000013","Hannover, GM":"CITY:GM000014","Kiel, GM":"CITY:GM000015","Leipzig, GM":"CITY:GM000016","Magdeburg, GM":"CITY:GM000017","Mainz, GM":"CITY:GM000018","Munich, GM":"CITY:GM000019","Potsdam, GM":"CITY:GM000020","Saarbrucken, GM":"CITY:GM000021","Schwerin, GM":"CITY:GM000022","Stuttgart, GM":"CITY:GM000023","Wiesbaden, GM":"CITY:GM000024","Athens, GR":"CITY:GR000001","Iraklion, GR":"CITY:GR000003","Larisa, GR":"CITY:GR000004","Piraeus, GR":"CITY:GR000006","Thessaloniki, GR":"CITY:GR000007","Guatemala, GT":"CITY:GT000004","Conakry, GV":"CITY:GV000001","Kankan, GV":"CITY:GV000002","Kindia, GV":"CITY:GV000003","Nzerekore, GV":"CITY:GV000004","Georgetown, GY":"CITY:GY000001","La Ceiba, HO":"CITY:HO000002","San Pedro Sula, HO":"CITY:HO000003","Tegucigalpa, HO":"CITY:HO000004","Rijeka, HR":"CITY:HR000001","Zagreb, HR":"CITY:HR000002","Budapest, HU":"CITY:HU000002","Debrecen, HU":"CITY:HU000003","Miskolc, HU":"CITY:HU000008","Pecs, HU":"CITY:HU000010","Szeged, HU":"CITY:HU000011","Reykjavik, IC":"CITY:IC000001","Ambon, ID":"CITY:ID000001","Balikpapan, ID":"CITY:ID000002","Banda Aceh, ID":"CITY:ID000003","Bandjermasin, ID":"CITY:ID000004","Bengkulu, ID":"CITY:ID000006","Denpasar, ID":"CITY:ID000007","Jakarta, ID":"CITY:ID000008","Jambi, ID":"CITY:ID000009","Jayapura, ID":"CITY:ID000010","Kupang, ID":"CITY:ID000011","Makassar, ID":"CITY:ID000012","Manado, ID":"CITY:ID000013","Mataram, ID":"CITY:ID000014","Medan, ID":"CITY:ID000015","Padang, ID":"CITY:ID000016","Palembang, ID":"CITY:ID000017","Palu, ID":"CITY:ID000018","Pontianak, ID":"CITY:ID000019","Samarinda, ID":"CITY:ID000020","Semarang, ID":"CITY:ID000021","Surabaja, ID":"CITY:ID000022","Tanjungkarang-Telukbetung, ID":"CITY:ID000023","Agartala, IN":"CITY:IN000001","Ahmadabad, IN":"CITY:IN000002","Aizawl, IN":"CITY:IN000003","Amritsar, IN":"CITY:IN000004","Bangalore, IN":"CITY:IN000005","Bhopal, IN":"CITY:IN000006","Bhubaneshwar, IN":"CITY:IN000007","Chandigarh, IN":"CITY:IN000008","Chennai, IN":"CITY:IN000009","Cochin, IN":"CITY:IN000010","Delhi, IN":"CITY:IN000011","Hyderabad, IN":"CITY:IN000012","Imphal, IN":"CITY:IN000013","Jaipur, IN":"CITY:IN000014","Kanpur, IN":"CITY:IN000015","Kohima, IN":"CITY:IN000016","Kolkata, IN":"CITY:IN000017","Lucknow, IN":"CITY:IN000018","Madurai, IN":"CITY:IN000019","Mangalore, IN":"CITY:IN000020","Mumbai, IN":"CITY:IN000021","Nagpur, IN":"CITY:IN000022","New Delhi, IN":"CITY:IN000023","Panaji, IN":"CITY:IN000024","Patna, IN":"CITY:IN000025","Pondicherry, IN":"CITY:IN000026","Port Blair, IN":"CITY:IN000027","Pune, IN":"CITY:IN000028","Shillong, IN":"CITY:IN000029","Simla, IN":"CITY:IN000030","Trivandrum, IN":"CITY:IN000031","Varanasi, IN":"CITY:IN000032","Vishakhapatnam, IN":"CITY:IN000033","Ahvaz, IR":"CITY:IR000001","Arak, IR":"CITY:IR000002","Esfahan, IR":"CITY:IR000003","Hamadan, IR":"CITY:IR000004","Ilam, IR":"CITY:IR000005","Kerman, IR":"CITY:IR000006","Kermanshah, IR":"CITY:IR000007","Khorramabad, IR":"CITY:IR000008","Mashhad, IR":"CITY:IR000009","Rasht, IR":"CITY:IR000010","Sanandaj, IR":"CITY:IR000011","Semnan, IR":"CITY:IR000013","Shahr-E Kord, IR":"CITY:IR000014","Shiraz, IR":"CITY:IR000015","Tabriz, IR":"CITY:IR000016","Tehran, IR":"CITY:IR000017","Yazd, IR":"CITY:IR000018","Zahedan, IR":"CITY:IR000019","Zanjan, IR":"CITY:IR000020","Beersheba, IS":"CITY:IS000001","Jerusalem, IS":"CITY:IS000003","Ramla, IS":"CITY:IS000005","Tel Aviv-Yafo, IS":"CITY:IS000006","Bologna, IT":"CITY:IT000004","Cagliari, IT":"CITY:IT000005","Campobasso, IT":"CITY:IT000006","Genoa, IT":"CITY:IT000009","Milan, IT":"CITY:IT000010","Naples, IT":"CITY:IT000011","Palermo, IT":"CITY:IT000012","Rome, IT":"CITY:IT000015","Trento, IT":"CITY:IT000016","Trieste, IT":"CITY:IT000017","Turin, IT":"CITY:IT000018","Abidjan, IV":"CITY:IV000002","Bondoukou, IV":"CITY:IV000005","Bouake, IV":"CITY:IV000007","Daloa, IV":"CITY:IV000008","Dimbokro, IV":"CITY:IV000010","Ferkessedougou, IV":"CITY:IV000012","Gagnoa, IV":"CITY:IV000013","Korhogo, IV":"CITY:IV000015","Man, IV":"CITY:IV000016","Yamoussoukro, IV":"CITY:IV000021","Al Basrah, IZ":"CITY:IZ000003","Aomori, JA":"CITY:JA000001","Fukuoka, JA":"CITY:JA000002","Gifu, JA":"CITY:JA000003","Hiroshima, JA":"CITY:JA000004","Kawasaki, JA":"CITY:JA000005","Kita Kyushu, JA":"CITY:JA000006","Kobe, JA":"CITY:JA000007","Kyoto, JA":"CITY:JA000008","Nagasaki, JA":"CITY:JA000009","Nagoya, JA":"CITY:JA000010","Naha, JA":"CITY:JA000011","Osaka, JA":"CITY:JA000012","Sapporo, JA":"CITY:JA000013","Sendai, JA":"CITY:JA000014","Shimonoseki, JA":"CITY:JA000015","Tokyo, JA":"CITY:JA000016","Yokohama, JA":"CITY:JA000017","Kingston, JM":"CITY:JM000001","Montego Bay, JM":"CITY:JM000002","Spanish Town, JM":"CITY:JM000003","Al Mafraq, JO":"CITY:JO000001","Az Zarqa', JO":"CITY:JO000004","Irbid, JO":"CITY:JO000005","Mombasa, KE":"CITY:KE000003","Nairobi, KE":"CITY:KE000004","Bishkek, KG":"CITY:KG000001","Karakol, KG":"CITY:KG000002","Osh, KG":"CITY:KG000003","Haeju, KN":"CITY:KN000002","Hyesan, KN":"CITY:KN000004","Kaesong, KN":"CITY:KN000005","P'yongyang, KN":"CITY:KN000007","Sariwon, KN":"CITY:KN000008","Sinuiju, KN":"CITY:KN000009","Wonsan, KN":"CITY:KN000010","Ch'unch'on, KS":"CITY:KS000001","Ch'ungju, KS":"CITY:KS000002","Cheju, KS":"CITY:KS000003","Chonju, KS":"CITY:KS000004","Inch`on, KS":"CITY:KS000005","Kwangju, KS":"CITY:KS000006","Pusan, KS":"CITY:KS000007","Seoul, KS":"CITY:KS000008","Taegu, KS":"CITY:KS000009","Taejon, KS":"CITY:KS000010","Kuwait, KU":"CITY:KU000001","Aktyubinsk, KZ":"CITY:KZ000001","Almaty, KZ":"CITY:KZ000002","Astana, KZ":"CITY:KZ000003","Atyrau, KZ":"CITY:KZ000004","Dzhambul, KZ":"CITY:KZ000005","Karaganda, KZ":"CITY:KZ000006","Kokshetau, KZ":"CITY:KZ000007","Kostanay, KZ":"CITY:KZ000008","Kyzylorda, KZ":"CITY:KZ000009","Pavlodar, KZ":"CITY:KZ000010","Petropavlovsk, KZ":"CITY:KZ000011","Semipalatinsk, KZ":"CITY:KZ000012","Shymkent, KZ":"CITY:KZ000013","Taldykorgan, KZ":"CITY:KZ000014","Ural'sk, KZ":"CITY:KZ000015","Ust'-Kamenogorsk, KZ":"CITY:KZ000016","Zhezkazgan, KZ":"CITY:KZ000017","Savannakhet, LA":"CITY:LA000001","Vientiane, LA":"CITY:LA000002","Beirut, LE":"CITY:LE000001","Tripoli, LE":"CITY:LE000003","Zahle, LE":"CITY:LE000004","Riga, LG":"CITY:LG000001","Vilnius, LH":"CITY:LH000001","Monrovia, LI":"CITY:LI000001","Banska Bystrica, LO":"CITY:LO000001","Kosice, LO":"CITY:LO000003","Mafeteng, LT":"CITY:LT000001","Maseru, LT":"CITY:LT000002","Luxembourg, LU":"CITY:LU000001","Ajdabiya, LY":"CITY:LY000001","Al Khums, LY":"CITY:LY000002","Benghazi, LY":"CITY:LY000003","Darnah, LY":"CITY:LY000004","Misratah, LY":"CITY:LY000005","Tripoli, LY":"CITY:LY000006","Antananarivo, MA":"CITY:MA000001","Antsiranana, MA":"CITY:MA000002","Fianarantsoa, MA":"CITY:MA000003","Mahajanga, MA":"CITY:MA000004","Toamasina, MA":"CITY:MA000005","Toliara, MA":"CITY:MA000006","Fort-De-France, MB":"CITY:MB000001","Chisinau, MD":"CITY:MD000001","Mamoutzou, MF":"CITY:MF000001","Ulaanbaatar, MG":"CITY:MG000002","Blantyre, MI":"CITY:MI000001","Lilongwe, MI":"CITY:MI000002","Podgorica, MJ":"CITY:MJ000001","Skopje, MK":"CITY:MK000001","Bamako, ML":"CITY:ML000001","Gao, ML":"CITY:ML000002","Kayes, ML":"CITY:ML000003","Mopti, ML":"CITY:ML000004","Segou, ML":"CITY:ML000005","Sikasso, ML":"CITY:ML000006","Casablanca, MO":"CITY:MO000002","Marrakech, MO":"CITY:MO000004","Meknes, MO":"CITY:MO000005","Oujda, MO":"CITY:MO000006","Rabat, MO":"CITY:MO000007","Port Louis, MP":"CITY:MP000001","Nouadhibou, MR":"CITY:MR000001","Nouakchott, MR":"CITY:MR000002","Muscat, MU":"CITY:MU000001","Acapulco, MX":"CITY:MX000001","Aguascalientes, MX":"CITY:MX000002","Campeche, MX":"CITY:MX000003","Chetumal, MX":"CITY:MX000004","Chihuahua, MX":"CITY:MX000005","Chilpancingo De Los Bravo, MX":"CITY:MX000006","Ciudad Victoria, MX":"CITY:MX000007","Colima, MX":"CITY:MX000008","Cuernavaca, MX":"CITY:MX000009","Culiacan, MX":"CITY:MX000010","Durango, MX":"CITY:MX000011","Guadalajara, MX":"CITY:MX000012","Guanajuato, MX":"CITY:MX000013","Hermosillo, MX":"CITY:MX000014","Jalapa, MX":"CITY:MX000015","La Paz, MX":"CITY:MX000016","Mazatlan, MX":"CITY:MX000017","Merida, MX":"CITY:MX000018","Mexicali, MX":"CITY:MX000019","Mexico City, MX":"CITY:MX000020","Monterrey, MX":"CITY:MX000021","Morelia, MX":"CITY:MX000022","Oaxaca, MX":"CITY:MX000023","Pachuca, MX":"CITY:MX000024","Puebla, MX":"CITY:MX000025","Queretaro, MX":"CITY:MX000026","Saltillo, MX":"CITY:MX000027","San Luis Potosi, MX":"CITY:MX000028","Tampico, MX":"CITY:MX000029","Tepic, MX":"CITY:MX000030","Tlaxcala, MX":"CITY:MX000031","Toluca, MX":"CITY:MX000032","Tuxtla Gutierrez, MX":"CITY:MX000033","Veracruz, MX":"CITY:MX000034","Villahermosa, MX":"CITY:MX000035","Zacatecas, MX":"CITY:MX000036","Johor Baharu, MY":"CITY:MY000003","Kota Baharu, MY":"CITY:MY000005","Kota Kinabalu, MY":"CITY:MY000006","Kuala Lumpur, MY":"CITY:MY000007","Kuantan New Port, MY":"CITY:MY000009","Kuching, MY":"CITY:MY000010","Melaka, MY":"CITY:MY000011","Pinang, MY":"CITY:MY000012","Shah Alam, MY":"CITY:MY000014","Beira, MZ":"CITY:MZ000001","Chimoio, MZ":"CITY:MZ000002","Inhambane, MZ":"CITY:MZ000003","Lichinga, MZ":"CITY:MZ000004","Maputo, MZ":"CITY:MZ000005","Nampula, MZ":"CITY:MZ000006","Pemba, MZ":"CITY:MZ000007","Quelimane, MZ":"CITY:MZ000008","Tete, MZ":"CITY:MZ000009","Xai-Xai, MZ":"CITY:MZ000010","Maradi, NG":"CITY:NG000001","Niamey, NG":"CITY:NG000002","Tahoua, NG":"CITY:NG000003","Zinder, NG":"CITY:NG000004","Enugu, NI":"CITY:NI000011","Ilorin, NI":"CITY:NI000013","Jos, NI":"CITY:NI000015","Kano, NI":"CITY:NI000017","Lagos, NI":"CITY:NI000019","Maiduguri, NI":"CITY:NI000021","Makurdi, NI":"CITY:NI000022","Minna, NI":"CITY:NI000023","Port Harcourt, NI":"CITY:NI000025","Yola, NI":"CITY:NI000028","'s-Hertogenbosch, NL":"CITY:NL000001","Amsterdam, NL":"CITY:NL000002","Arnhem, NL":"CITY:NL000003","Assen, NL":"CITY:NL000004","Groningen, NL":"CITY:NL000005","Haarlem, NL":"CITY:NL000006","Leeuwarden, NL":"CITY:NL000007","Maastricht, NL":"CITY:NL000008","Rotterdam, NL":"CITY:NL000009","The Hague, NL":"CITY:NL000010","Utrecht, NL":"CITY:NL000011","Zwolle, NL":"CITY:NL000012","Bergen, NO":"CITY:NO000001","Drammen, NO":"CITY:NO000002","Kristiansand, NO":"CITY:NO000003","Oslo, NO":"CITY:NO000004","Stavanger, NO":"CITY:NO000005","Tromso, NO":"CITY:NO000006","Trondheim, NO":"CITY:NO000007","Bhairawa, NP":"CITY:NP000001","Biratnagar, NP":"CITY:NP000002","Kathmandu, NP":"CITY:NP000004","Willemstad, NT":"CITY:NT000001","Chinandega, NU":"CITY:NU000001","Esteli, NU":"CITY:NU000002","Jinotega, NU":"CITY:NU000004","Juigalpa, NU":"CITY:NU000005","Managua, NU":"CITY:NU000007","Masaya, NU":"CITY:NU000008","Matagalpa, NU":"CITY:NU000009","Auckland, NZ":"CITY:NZ000001","Christchurch, NZ":"CITY:NZ000002","Wellington, NZ":"CITY:NZ000007","Asuncion, PA":"CITY:PA000001","Coronel Oviedo, PA":"CITY:PA000002","Encarnacion, PA":"CITY:PA000003","Arequipa, PE":"CITY:PE000002","Ayacucho, PE":"CITY:PE000003","Cajamarca, PE":"CITY:PE000004","Callao, PE":"CITY:PE000005","Chiclayo, PE":"CITY:PE000007","Cuzco, PE":"CITY:PE000009","Huanuco, PE":"CITY:PE000011","Huaraz, PE":"CITY:PE000012","Iquitos, PE":"CITY:PE000014","Lima, PE":"CITY:PE000015","Piura, PE":"CITY:PE000017","Pucallpa, PE":"CITY:PE000018","Tacna, PE":"CITY:PE000020","Trujillo, PE":"CITY:PE000021","Tumbes, PE":"CITY:PE000022","Hyderabad, PK":"CITY:PK000002","Islamabad, PK":"CITY:PK000003","Karachi, PK":"CITY:PK000004","Lahore, PK":"CITY:PK000005","Peshawar, PK":"CITY:PK000006","Quetta, PK":"CITY:PK000007","Rawalpindi, PK":"CITY:PK000008","Bialystok, PL":"CITY:PL000002","Elblag, PL":"CITY:PL000007","Krakow, PL":"CITY:PL000017","Poznan, PL":"CITY:PL000030","Siedlce, PL":"CITY:PL000034","Szczecin, PL":"CITY:PL000037","Warsaw, PL":"CITY:PL000042","Wroclaw, PL":"CITY:PL000044","Colon, PM":"CITY:PM000001","Panama, PM":"CITY:PM000003","Aveiro, PO":"CITY:PO000001","Braga, PO":"CITY:PO000002","Coimbra, PO":"CITY:PO000003","Evora, PO":"CITY:PO000004","Funchal, PO":"CITY:PO000005","Lisbon, PO":"CITY:PO000006","Porto, PO":"CITY:PO000007","Port Moresby, PP":"CITY:PP000002","Bissau, PU":"CITY:PU000001","Doha, QA":"CITY:QA000001","Belgrade, RB":"CITY:RB000001","Saint-Denis, RE":"CITY:RE000001","Arad, RO":"CITY:RO000002","Bacau, RO":"CITY:RO000003","Baia Mare, RO":"CITY:RO000004","Bistrita, RO":"CITY:RO000005","Botosani, RO":"CITY:RO000006","Braila, RO":"CITY:RO000007","Bucharest, RO":"CITY:RO000009","Buzau, RO":"CITY:RO000010","Calarasi, RO":"CITY:RO000011","Cluj-Napoca, RO":"CITY:RO000012","Constanta, RO":"CITY:RO000013","Craiova, RO":"CITY:RO000014","Deva, RO":"CITY:RO000015","Drobeta- Turmu Sererin, RO":"CITY:RO000016","Galati, RO":"CITY:RO000018","Iasi, RO":"CITY:RO000020","Rimnicu Vilcea, RO":"CITY:RO000026","Sibiu, RO":"CITY:RO000029","Suceava, RO":"CITY:RO000032","Targu Jiu, RO":"CITY:RO000034","Timisoara, RO":"CITY:RO000036","Tulcea, RO":"CITY:RO000037","Manila, RP":"CITY:RP000002","Mayaguez, RQ":"CITY:RQ000001","Ponce, RQ":"CITY:RQ000002","San Juan, RQ":"CITY:RQ000003","Abakan, RS":"CITY:RS000001","Arkangel'sk, RS":"CITY:RS000002","Astrakhan, RS":"CITY:RS000003","Barnaul, RS":"CITY:RS000004","Belgorod, RS":"CITY:RS000005","Birobidzhan, RS":"CITY:RS000006","Blagoveshchensk, RS":"CITY:RS000007","Ceboksary, RS":"CITY:RS000008","Chelyabinsk, RS":"CITY:RS000009","Chita, RS":"CITY:RS000011","Elista, RS":"CITY:RS000012","Gor'kiy, RS":"CITY:RS000013","Gorno-Altaysk, RS":"CITY:RS000014","Groznyy, RS":"CITY:RS000015","Irkutsk, RS":"CITY:RS000016","Ivanovo, RS":"CITY:RS000017","Izevsk, RS":"CITY:RS000018","Kaliningrad, RS":"CITY:RS000019","Kaluga, RS":"CITY:RS000020","Kazan', RS":"CITY:RS000021","Kemerovo, RS":"CITY:RS000022","Khabarovsk, RS":"CITY:RS000023","Khanty-Mansiysk, RS":"CITY:RS000024","Klintsy, RS":"CITY:RS000025","Kostroma, RS":"CITY:RS000026","Kotlas, RS":"CITY:RS000027","Krasnodar, RS":"CITY:RS000028","Krasnoyarsk, RS":"CITY:RS000029","Kurgan, RS":"CITY:RS000030","Kursk, RS":"CITY:RS000031","Kuybyskev, RS":"CITY:RS000032","Kyzyl, RS":"CITY:RS000033","Lipetsk, RS":"CITY:RS000034","Machackala, RS":"CITY:RS000035","Magadan, RS":"CITY:RS000036","Majkop, RS":"CITY:RS000037","Moscow, RS":"CITY:RS000038","Murmansk, RS":"CITY:RS000039","Nazran, RS":"CITY:RS000041","Novgorod, RS":"CITY:RS000043","Novokuznetsk, RS":"CITY:RS000044","Novosibirsk, RS":"CITY:RS000045","Omsk, RS":"CITY:RS000046","Orel, RS":"CITY:RS000047","Orenburg, RS":"CITY:RS000048","Penza, RS":"CITY:RS000049","Perm', RS":"CITY:RS000050","Petropavloski-Kamchatskiy, RS":"CITY:RS000051","Petrozavodsk, RS":"CITY:RS000052","Pskov, RS":"CITY:RS000053","Rostov-on-Don, RS":"CITY:RS000054","Ryazan, RS":"CITY:RS000055","Saint Petersburg, RS":"CITY:RS000056","Saransk, RS":"CITY:RS000057","Saratov, RS":"CITY:RS000058","Smolensk, RS":"CITY:RS000059","Stavropol, RS":"CITY:RS000060","Sverdlovsk, RS":"CITY:RS000061","Syktyvkar, RS":"CITY:RS000062","Tambov, RS":"CITY:RS000063","Tomsk, RS":"CITY:RS000064","Tula, RS":"CITY:RS000065","Tver, RS":"CITY:RS000066","Tyumen, RS":"CITY:RS000067","Ufa, RS":"CITY:RS000068","Ul'yanovsk, RS":"CITY:RS000069","Ulan Ude, RS":"CITY:RS000070","Vladikavkaz, RS":"CITY:RS000071","Vladimir, RS":"CITY:RS000072","Vladivostok, RS":"CITY:RS000073","Volgograd, RS":"CITY:RS000074","Vologda, RS":"CITY:RS000075","Vorkuta, RS":"CITY:RS000076","Voronezh, RS":"CITY:RS000077","Vyatka, RS":"CITY:RS000078","Yakutsk, RS":"CITY:RS000079","Yaroslavl, RS":"CITY:RS000080","Yuzhno-Sakhalinsk, RS":"CITY:RS000081","Kigali, RW":"CITY:RW000006","Abha, SA":"CITY:SA000001","Jeddah, SA":"CITY:SA000003","Mecca, SA":"CITY:SA000004","Medina, SA":"CITY:SA000005","Riyadh, SA":"CITY:SA000007","Sakakah, SA":"CITY:SA000008","Tabuk, SA":"CITY:SA000009","Bisho, SF":"CITY:SF000001","Bloemfontein, SF":"CITY:SF000002","Cape Town, SF":"CITY:SF000003","Durban, SF":"CITY:SF000004","Johannesburg, SF":"CITY:SF000005","Kimberley, SF":"CITY:SF000006","MMabatho (Mafikeng), SF":"CITY:SF000007","Nelspruit, SF":"CITY:SF000008","Pietermaritzburg (Ulundi), SF":"CITY:SF000009","Pietersburg (Polokwane), SF":"CITY:SF000010","Port Elizabeth, SF":"CITY:SF000011","Pretoria, SF":"CITY:SF000012","Richards Bay, SF":"CITY:SF000013","Dakar, SG":"CITY:SG000001","Kolda, SG":"CITY:SG000002","Thies, SG":"CITY:SG000003","Ziguinchor, SG":"CITY:SG000004","Ljubljana, SI":"CITY:SI000001","Freetown, SL":"CITY:SL000002","Singapore, SN":"CITY:SN000001","Barcelona, SP":"CITY:SP000001","Bilbao, SP":"CITY:SP000002","Ceuta, SP":"CITY:SP000003","Logrono, SP":"CITY:SP000005","Madrid, SP":"CITY:SP000006","Melilla, SP":"CITY:SP000007","Murcia, SP":"CITY:SP000009","Oviedo, SP":"CITY:SP000010","Palma De Mallorca, SP":"CITY:SP000011","Pamplona, SP":"CITY:SP000012","Santa Cruz de Tenerife, SP":"CITY:SP000013","Santander, SP":"CITY:SP000014","Santiago De Compostela, SP":"CITY:SP000015","Seville, SP":"CITY:SP000016","Toledo, SP":"CITY:SP000017","Valencia, SP":"CITY:SP000018","Valladolid, SP":"CITY:SP000019","Vitoria, SP":"CITY:SP000020","Zaragoza, SP":"CITY:SP000021","El Fasher, SU":"CITY:SU000001","El Obeid, SU":"CITY:SU000002","Khartoum, SU":"CITY:SU000003","Malakal, SU":"CITY:SU000004","Omdurman, SU":"CITY:SU000005","Port Sudan, SU":"CITY:SU000006","Wau, SU":"CITY:SU000007","Gavle, SW":"CITY:SW000001","Goteborg, SW":"CITY:SW000002","Halmstad, SW":"CITY:SW000003","Jonkoping, SW":"CITY:SW000004","Karlstad, SW":"CITY:SW000005","Linkoping, SW":"CITY:SW000006","Malmo, SW":"CITY:SW000007","Orebro, SW":"CITY:SW000008","Stockholm, SW":"CITY:SW000009","Umea, SW":"CITY:SW000010","Uppsala, SW":"CITY:SW000011","Vasteras, SW":"CITY:SW000012","Vaxjo, SW":"CITY:SW000013","Aleppo, SY":"CITY:SY000001","Damascus, SY":"CITY:SY000004","Dayr az Zawr, SY":"CITY:SY000005","Hamah, SY":"CITY:SY000006","Homs, SY":"CITY:SY000007","Tartus, SY":"CITY:SY000009","Basel, SZ":"CITY:SZ000001","Geneva, SZ":"CITY:SZ000003","Saint Gallen, SZ":"CITY:SZ000006","Zurich, SZ":"CITY:SZ000007","Bangkok, TH":"CITY:TH000001","Chang Rai, TH":"CITY:TH000003","Chanthaburi, TH":"CITY:TH000004","Chiang Mai, TH":"CITY:TH000005","Chon Buri, TH":"CITY:TH000006","Chumphon, TH":"CITY:TH000007","Kanchanaburi, TH":"CITY:TH000010","Khon Kaen, TH":"CITY:TH000011","Lampang, TH":"CITY:TH000012","Nakhon Ratchasima, TH":"CITY:TH000015","Nakhon Si Thammarat, TH":"CITY:TH000016","Nong Khai, TH":"CITY:TH000017","Phetchabun, TH":"CITY:TH000018","Phitsanulok, TH":"CITY:TH000019","Phuket, TH":"CITY:TH000021","Sakon Nakhon, TH":"CITY:TH000023","Samut Prakan, TH":"CITY:TH000024","Supham Buri, TH":"CITY:TH000026","Surat Thani, TH":"CITY:TH000027","Trang, TH":"CITY:TH000028","Ubon Ratchathani, TH":"CITY:TH000029","Udon Thani, TH":"CITY:TH000030","Uttaradit, TH":"CITY:TH000031","Dushanbe, TI":"CITY:TI000001","Kulob, TI":"CITY:TI000002","Leninobod, TI":"CITY:TI000003","Qurghonteppa, TI":"CITY:TI000004","Lome, TO":"CITY:TO000003","Bizerte, TS":"CITY:TS000002","Gabes, TS":"CITY:TS000003","Gafsa, TS":"CITY:TS000004","Jendouba, TS":"CITY:TS000005","Kairouan, TS":"CITY:TS000006","Sfax, TS":"CITY:TS000009","Tunis, TS":"CITY:TS000012","Adiyaman, TU":"CITY:TU000001","Agri, TU":"CITY:TU000002","Aintab, TU":"CITY:TU000003","Ankara, TU":"CITY:TU000005","Antalya, TU":"CITY:TU000006","Aydin, TU":"CITY:TU000008","Balikesir, TU":"CITY:TU000009","Bingol, TU":"CITY:TU000010","Bolu, TU":"CITY:TU000011","Burdur, TU":"CITY:TU000012","Bursa, TU":"CITY:TU000013","Canakkale, TU":"CITY:TU000014","Cankiri, TU":"CITY:TU000015","Corum, TU":"CITY:TU000016","Denizli, TU":"CITY:TU000017","Diyarbakir, TU":"CITY:TU000018","Edirne, TU":"CITY:TU000019","Elazig, TU":"CITY:TU000020","Erzincan, TU":"CITY:TU000021","Erzurum, TU":"CITY:TU000022","Giresun, TU":"CITY:TU000024","Hakkari, TU":"CITY:TU000025","Isparta, TU":"CITY:TU000026","Istanbul, TU":"CITY:TU000027","Izmir, TU":"CITY:TU000028","Kahramanmaras, TU":"CITY:TU000029","Kars, TU":"CITY:TU000030","Kastamonu, TU":"CITY:TU000031","Kirsehir, TU":"CITY:TU000034","Konya, TU":"CITY:TU000036","Kutahya, TU":"CITY:TU000037","Malatya, TU":"CITY:TU000038","Mersin, TU":"CITY:TU000041","Mus, TU":"CITY:TU000042","Nevsehir, TU":"CITY:TU000043","Nigde, TU":"CITY:TU000044","Rize, TU":"CITY:TU000046","Sakarya, TU":"CITY:TU000047","Samsun, TU":"CITY:TU000048","Siirt, TU":"CITY:TU000049","Sivas, TU":"CITY:TU000050","Tekirdag, TU":"CITY:TU000051","Tokat, TU":"CITY:TU000052","Usak, TU":"CITY:TU000054","Van, TU":"CITY:TU000055","Yozgat, TU":"CITY:TU000056","Zonguldak, TU":"CITY:TU000057","Ashgabat, TX":"CITY:TX000001","Mary, TX":"CITY:TX000002","Turkmenbashi, TX":"CITY:TX000003","Arusha, TZ":"CITY:TZ000001","Bukoba, TZ":"CITY:TZ000002","Dar es Salaam, TZ":"CITY:TZ000003","Dodoma, TZ":"CITY:TZ000004","Iringa, TZ":"CITY:TZ000005","Moshi, TZ":"CITY:TZ000009","Mtwara, TZ":"CITY:TZ000010","Musoma, TZ":"CITY:TZ000011","Mwanza, TZ":"CITY:TZ000012","Songea, TZ":"CITY:TZ000015","Tabora, TZ":"CITY:TZ000017","Zanzibar, TZ":"CITY:TZ000019","Arua, UG":"CITY:UG000001","Gulu, UG":"CITY:UG000002","Jinja, UG":"CITY:UG000003","Belfast, UK":"CITY:UK000001","Birmingham, UK":"CITY:UK000002","Dundee, UK":"CITY:UK000004","Liverpool, UK":"CITY:UK000008","London, UK":"CITY:UK000009","Manchester, UK":"CITY:UK000010","Cherkasy, UP":"CITY:UP000001","Chernihiv, UP":"CITY:UP000002","Chernivtsi, UP":"CITY:UP000003","Dnipropetrovs'k, UP":"CITY:UP000004","Donets'k, UP":"CITY:UP000005","Ivano-frankivs'k, UP":"CITY:UP000006","Kharkiv, UP":"CITY:UP000007","Kherson, UP":"CITY:UP000008","Khmel'nyts'kyz, UP":"CITY:UP000009","Kirovohrad, UP":"CITY:UP000010","Kovel', UP":"CITY:UP000011","Kyiv, UP":"CITY:UP000012","L'viv, UP":"CITY:UP000013","Luhans'k, UP":"CITY:UP000014","Mykolayiv, UP":"CITY:UP000015","Odesa, UP":"CITY:UP000016","Poltava, UP":"CITY:UP000017","Rivne, UP":"CITY:UP000018","Simferopol', UP":"CITY:UP000019","Sumy, UP":"CITY:UP000020","Ternopil', UP":"CITY:UP000021","Uzhhorod, UP":"CITY:UP000022","Vinnytsya, UP":"CITY:UP000023","Zaporiyhzhya, UP":"CITY:UP000024","Zhytomyra, UP":"CITY:UP000025","Washington D.C., US":"CITY:US000001","Alexander City, AL US":"CITY:US010001","Anniston, AL US":"CITY:US010002","Auburn, AL US":"CITY:US010003","Birmingham, AL US":"CITY:US010004","Cullman, AL US":"CITY:US010005","Dothan, AL US":"CITY:US010006","Enterprise, AL US":"CITY:US010007","Eufaula, AL US":"CITY:US010008","Florence, AL US":"CITY:US010009","Fort Payne, AL US":"CITY:US010010","Gadsden, AL US":"CITY:US010011","Huntsville, AL US":"CITY:US010012","Jasper, AL US":"CITY:US010013","Mobile, AL US":"CITY:US010014","Montgomery, AL US":"CITY:US010015","Selma, AL US":"CITY:US010016","Talladega, AL US":"CITY:US010017","Troy, AL US":"CITY:US010018","Tuscaloosa, AL US":"CITY:US010019","Anchorage, AK US":"CITY:US020001","Fairbanks, AK US":"CITY:US020002","Juneau, AK US":"CITY:US020003","Nome, AK US":"CITY:US020004","Seward, AK US":"CITY:US020005","Bullhead City, AZ US":"CITY:US040001","Casa Grande, AZ US":"CITY:US040002","Douglas, AZ US":"CITY:US040003","Flagstaff, AZ US":"CITY:US040004","Green Valley, AZ US":"CITY:US040005","Kingman, AZ US":"CITY:US040006","Lake Havasu City, AZ US":"CITY:US040007","Mesa, AZ US":"CITY:US040008","Nogales, AZ US":"CITY:US040009","Payson, AZ US":"CITY:US040010","Phoenix, AZ US":"CITY:US040011","Prescott, AZ US":"CITY:US040012","Sierra Vista, AZ US":"CITY:US040013","Tucson, AZ US":"CITY:US040014","Yuma, AZ US":"CITY:US040015","Arkadelphia, AR US":"CITY:US050001","Blytheville, AR US":"CITY:US050002","Camden, AR US":"CITY:US050003","Conway, AR US":"CITY:US050004","El Dorado, AR US":"CITY:US050005","Fayetteville, AR US":"CITY:US050006","Forrest City, AR US":"CITY:US050007","Fort Smith, AR US":"CITY:US050008","Harrison, AR US":"CITY:US050009","Hope, AR US":"CITY:US050010","Hot Springs, AR US":"CITY:US050011","Jonesboro, AR US":"CITY:US050012","Little Rock, AR US":"CITY:US050013","Magnolia, AR US":"CITY:US050014","Mountain Home, AR US":"CITY:US050015","Paragould, AR US":"CITY:US050016","Pine Bluff, AR US":"CITY:US050017","Russellville, AR US":"CITY:US050018","Searcy, AR US":"CITY:US050019","Siloam Springs, AR US":"CITY:US050020","Anaheim, CA US":"CITY:US060001","Bakersfield, CA US":"CITY:US060002","Barstow, CA US":"CITY:US060003","Blythe, CA US":"CITY:US060004","Chico, CA US":"CITY:US060005","Clearlake, CA US":"CITY:US060006","Coalinga, CA US":"CITY:US060007","El Centro, CA US":"CITY:US060008","Eureka, CA US":"CITY:US060009","Fresno, CA US":"CITY:US060010","Grass Valley, CA US":"CITY:US060011","Long Beach, CA US":"CITY:US060012","Los Angeles, CA US":"CITY:US060013","Merced, CA US":"CITY:US060014","Modesto, CA US":"CITY:US060015","Monterey, CA US":"CITY:US060016","Napa, CA US":"CITY:US060017","Oakland, CA US":"CITY:US060018","Oceanside, CA US":"CITY:US060019","Oxnard, CA US":"CITY:US060020","Palm Springs, CA US":"CITY:US060021","Red Bluff, CA US":"CITY:US060022","Redding, CA US":"CITY:US060023","Ridgecrest, CA US":"CITY:US060024","Riverside, CA US":"CITY:US060025","Rosamond, CA US":"CITY:US060026","Sacramento, CA US":"CITY:US060027","Salinas, CA US":"CITY:US060028","San Bernardino, CA US":"CITY:US060029","San Diego, CA US":"CITY:US060030","San Francisco, CA US":"CITY:US060031","San Jose, CA US":"CITY:US060032","San Luis Obispo, CA US":"CITY:US060033","Santa Ana, CA US":"CITY:US060034","Santa Barbara, CA US":"CITY:US060035","Santa Clarita, CA US":"CITY:US060036","Santa Cruz, CA US":"CITY:US060037","Santa Maria, CA US":"CITY:US060038","Santa Rosa, CA US":"CITY:US060039","Simi Valley, CA US":"CITY:US060040","Soledad, CA US":"CITY:US060041","Stockton, CA US":"CITY:US060042","Susanville, CA US":"CITY:US060043","Ukiah, CA US":"CITY:US060044","Vallejo, CA US":"CITY:US060045","Visalia, CA US":"CITY:US060046","Yuba City, CA US":"CITY:US060047","Yucca Valley, CA US":"CITY:US060048","Boulder, CO US":"CITY:US080001","Canon City, CO US":"CITY:US080002","Colorado Springs, CO US":"CITY:US080003","Denver, CO US":"CITY:US080004","Durango, CO US":"CITY:US080005","Fort Collins, CO US":"CITY:US080006","Fort Morgan, CO US":"CITY:US080007","Grand Junction, CO US":"CITY:US080008","Montrose, CO US":"CITY:US080009","Pueblo, CO US":"CITY:US080010","Sterling, CO US":"CITY:US080011","Bridgeport, CT US":"CITY:US090001","Danbury, CT US":"CITY:US090002","Hartford, CT US":"CITY:US090003","New Haven, CT US":"CITY:US090004","New London, CT US":"CITY:US090005","Norwalk, CT US":"CITY:US090006","Norwich, CT US":"CITY:US090007","Stamford, CT US":"CITY:US090008","Torrington, CT US":"CITY:US090009","Waterbury, CT US":"CITY:US090010","Willimantic, CT US":"CITY:US090011","Dover, DE US":"CITY:US100001","Newark, DE US":"CITY:US100002","Belle Glade, FL US":"CITY:US120001","Boca Raton, FL US":"CITY:US120002","Boynton Beach, FL US":"CITY:US120003","Bradenton, FL US":"CITY:US120004","Cape Coral, FL US":"CITY:US120005","Cocoa, FL US":"CITY:US120006","Coral Springs, FL US":"CITY:US120007","Crestview, FL US":"CITY:US120008","Daytona Beach, FL US":"CITY:US120009","Deltona, FL US":"CITY:US120010","Destin, FL US":"CITY:US120011","Fort Lauderdale, FL US":"CITY:US120012","Fort Myers, FL US":"CITY:US120013","Fort Walton Beach, FL US":"CITY:US120014","Gainesville, FL US":"CITY:US120015","Homosassa Springs, FL US":"CITY:US120016","Immokalee, FL US":"CITY:US120017","Jacksonville, FL US":"CITY:US120018","Jupiter, FL US":"CITY:US120019","Key Largo, FL US":"CITY:US120020","Key West, FL US":"CITY:US120021","Kissimmee, FL US":"CITY:US120022","Marathon, FL US":"CITY:US120023","Melbourne, FL US":"CITY:US120024","Miami, FL US":"CITY:US120025","Naples, FL US":"CITY:US120026","Ocala, FL US":"CITY:US120027","Orlando, FL US":"CITY:US120028","Palatka, FL US":"CITY:US120029","Palm Coast, FL US":"CITY:US120030","Panama City, FL US":"CITY:US120031","Pensacola, FL US":"CITY:US120032","Pompano Beach, FL US":"CITY:US120033","Port Charlotte, FL US":"CITY:US120034","Port St. Lucie, FL US":"CITY:US120035","Sarasota, FL US":"CITY:US120036","Spring Hill, FL US":"CITY:US120037","St. Augustine, FL US":"CITY:US120038","St. Petersburg, FL US":"CITY:US120039","Tallahassee, FL US":"CITY:US120040","Tampa, FL US":"CITY:US120041","Titusville, FL US":"CITY:US120042","West Palm Beach, FL US":"CITY:US120043","Albany, GA US":"CITY:US130001","Americus, GA US":"CITY:US130002","Athens, GA US":"CITY:US130003","Atlanta, GA US":"CITY:US130004","Augusta, GA US":"CITY:US130005","Bainbridge, GA US":"CITY:US130006","Brunswick, GA US":"CITY:US130007","Carrollton, GA US":"CITY:US130008","Columbus, GA US":"CITY:US130009","Dalton, GA US":"CITY:US130010","Douglas, GA US":"CITY:US130011","Dublin, GA US":"CITY:US130012","Fort Benning South, GA US":"CITY:US130013","Gainesville, GA US":"CITY:US130014","Griffin, GA US":"CITY:US130015","Hinesville, GA US":"CITY:US130016","LaGrange, GA US":"CITY:US130017","Macon, GA US":"CITY:US130018","Milledgeville, GA US":"CITY:US130019","Peachtree City, GA US":"CITY:US130020","Rome, GA US":"CITY:US130021","Savannah, GA US":"CITY:US130022","St. Marys, GA US":"CITY:US130023","Statesboro, GA US":"CITY:US130024","Thomasville, GA US":"CITY:US130025","Tifton, GA US":"CITY:US130026","Valdosta, GA US":"CITY:US130027","Vidalia, GA US":"CITY:US130028","Waycross, GA US":"CITY:US130029","Hilo, HI US":"CITY:US150001","Honolulu, HI US":"CITY:US150002","Kahului, HI US":"CITY:US150003","Boise, ID US":"CITY:US160001","Coeur d'Alene, ID US":"CITY:US160002","Idaho Falls, ID US":"CITY:US160003","Lewiston, ID US":"CITY:US160004","Moscow, ID US":"CITY:US160005","Mountain Home, ID US":"CITY:US160006","Nampa, ID US":"CITY:US160007","Pocatello, ID US":"CITY:US160008","Twin Falls, ID US":"CITY:US160009","Aurora, IL US":"CITY:US170001","Bloomington, IL US":"CITY:US170002","Carbondale, IL US":"CITY:US170003","Champaign, IL US":"CITY:US170004","Charleston, IL US":"CITY:US170005","Chicago, IL US":"CITY:US170006","Crystal Lake, IL US":"CITY:US170007","Danville, IL US":"CITY:US170008","DeKalb, IL US":"CITY:US170009","Decatur, IL US":"CITY:US170010","Dixon, IL US":"CITY:US170011","Effingham, IL US":"CITY:US170012","Elgin, IL US":"CITY:US170013","Freeport, IL US":"CITY:US170014","Galesburg, IL US":"CITY:US170015","Joliet, IL US":"CITY:US170016","Kankakee, IL US":"CITY:US170017","Kewanee, IL US":"CITY:US170018","Lincoln, IL US":"CITY:US170019","Macomb, IL US":"CITY:US170020","Mount Vernon, IL US":"CITY:US170021","Naperville, IL US":"CITY:US170022","Ottawa, IL US":"CITY:US170023","Peoria, IL US":"CITY:US170024","Pontiac, IL US":"CITY:US170025","Quincy, IL US":"CITY:US170026","Rockford, IL US":"CITY:US170027","Springfield, IL US":"CITY:US170028","Streator, IL US":"CITY:US170029","Waukegan, IL US":"CITY:US170030","Bloomington, IN US":"CITY:US180001","Evansville, IN US":"CITY:US180002","Fort Wayne, IN US":"CITY:US180003","Indianapolis, IN US":"CITY:US180004","Kokomo, IN US":"CITY:US180005","Lafayette, IN US":"CITY:US180006","Madison, IN US":"CITY:US180007","Michigan City, IN US":"CITY:US180008","Muncie, IN US":"CITY:US180009","Richmond, IN US":"CITY:US180010","Shelbyville, IN US":"CITY:US180011","South Bend, IN US":"CITY:US180012","Terre Haute, IN US":"CITY:US180013","Vincennes, IN US":"CITY:US180014","Ames, IA US":"CITY:US190001","Burlington, IA US":"CITY:US190002","Carroll, IA US":"CITY:US190003","Cedar Falls, IA US":"CITY:US190004","Cedar Rapids, IA US":"CITY:US190005","Clinton, IA US":"CITY:US190006","Davenport, IA US":"CITY:US190007","Des Moines, IA US":"CITY:US190008","Dubuque, IA US":"CITY:US190009","Fort Dodge, IA US":"CITY:US190010","Iowa City, IA US":"CITY:US190011","Keokuk, IA US":"CITY:US190012","Marshalltown, IA US":"CITY:US190013","Mason City, IA US":"CITY:US190014","Oskaloosa, IA US":"CITY:US190015","Ottumwa, IA US":"CITY:US190016","Sioux City, IA US":"CITY:US190017","Spencer, IA US":"CITY:US190018","Storm Lake, IA US":"CITY:US190019","Waterloo, IA US":"CITY:US190020","Coffeyville, KS US":"CITY:US200001","Dodge City, KS US":"CITY:US200002","Emporia, KS US":"CITY:US200003","Garden City, KS US":"CITY:US200004","Great Bend, KS US":"CITY:US200005","Hays, KS US":"CITY:US200006","Hutchinson, KS US":"CITY:US200007","Lawrence, KS US":"CITY:US200008","Leavenworth, KS US":"CITY:US200009","Liberal, KS US":"CITY:US200010","Manhattan, KS US":"CITY:US200011","Pittsburg, KS US":"CITY:US200012","Salina, KS US":"CITY:US200013","Topeka, KS US":"CITY:US200014","Wichita, KS US":"CITY:US200015","Winfield, KS US":"CITY:US200016","Bowling Green, KY US":"CITY:US210001","Campbellsville, KY US":"CITY:US210002","Danville, KY US":"CITY:US210003","Elizabethtown, KY US":"CITY:US210004","Fort Knox, KY US":"CITY:US210005","Frankfort, KY US":"CITY:US210006","Hopkinsville, KY US":"CITY:US210007","Lexington, KY US":"CITY:US210008","Louisville, KY US":"CITY:US210009","Madisonville, KY US":"CITY:US210010","Middlesborough, KY US":"CITY:US210011","Murray, KY US":"CITY:US210012","Owensboro, KY US":"CITY:US210013","Paducah, KY US":"CITY:US210014","Somerset, KY US":"CITY:US210015","Alexandria, LA US":"CITY:US220001","Bastrop, LA US":"CITY:US220002","Baton Rouge, LA US":"CITY:US220003","Bogalusa, LA US":"CITY:US220004","Fort Polk South, LA US":"CITY:US220005","Hammond, LA US":"CITY:US220006","Houma, LA US":"CITY:US220007","Jennings, LA US":"CITY:US220008","Lafayette, LA US":"CITY:US220009","Lake Charles, LA US":"CITY:US220010","Minden, LA US":"CITY:US220011","Monroe, LA US":"CITY:US220012","Morgan City, LA US":"CITY:US220013","Natchitoches, LA US":"CITY:US220014","New Iberia, LA US":"CITY:US220015","New Orleans, LA US":"CITY:US220016","Opelousas, LA US":"CITY:US220017","Ruston, LA US":"CITY:US220018","Shreveport, LA US":"CITY:US220019","Thibodaux, LA US":"CITY:US220020","Augusta, ME US":"CITY:US230001","Bangor, ME US":"CITY:US230002","Lewiston, ME US":"CITY:US230003","Portland, ME US":"CITY:US230004","Waterville, ME US":"CITY:US230005","Annapolis, MD US":"CITY:US240001","Baltimore, MD US":"CITY:US240002","Cambridge, MD US":"CITY:US240003","Cumberland, MD US":"CITY:US240004","Easton, MD US":"CITY:US240005","Frederick, MD US":"CITY:US240006","Hagerstown, MD US":"CITY:US240007","Ocean Pines, MD US":"CITY:US240008","Salisbury, MD US":"CITY:US240009","Westminster, MD US":"CITY:US240010","Barnstable Town, MA US":"CITY:US250001","Boston, MA US":"CITY:US250002","Brockton, MA US":"CITY:US250003","Fall River, MA US":"CITY:US250004","Gloucester, MA US":"CITY:US250005","Greenfield, MA US":"CITY:US250006","Leominster, MA US":"CITY:US250007","Lowell, MA US":"CITY:US250008","New Bedford, MA US":"CITY:US250009","North Adams, MA US":"CITY:US250010","Northampton, MA US":"CITY:US250011","Pittsfield, MA US":"CITY:US250012","Springfield, MA US":"CITY:US250013","Worcester, MA US":"CITY:US250014","Alpena, MI US":"CITY:US260001","Ann Arbor, MI US":"CITY:US260002","Benton Harbor, MI US":"CITY:US260003","Big Rapids, MI US":"CITY:US260004","Cadillac, MI US":"CITY:US260005","Detroit, MI US":"CITY:US260006","Escanaba, MI US":"CITY:US260007","Flint, MI US":"CITY:US260008","Grand Rapids, MI US":"CITY:US260009","Holland, MI US":"CITY:US260010","Jackson, MI US":"CITY:US260011","Kalamazoo, MI US":"CITY:US260012","Lansing, MI US":"CITY:US260013","Marquette, MI US":"CITY:US260014","Midland, MI US":"CITY:US260015","Mount Pleasant, MI US":"CITY:US260016","Muskegon, MI US":"CITY:US260017","Owosso, MI US":"CITY:US260018","Pontiac, MI US":"CITY:US260019","Port Huron, MI US":"CITY:US260020","Saginaw, MI US":"CITY:US260021","Sault Ste. Marie, MI US":"CITY:US260022","Sturgis, MI US":"CITY:US260023","Traverse City, MI US":"CITY:US260024","Austin, MN US":"CITY:US270001","Bemidji, MN US":"CITY:US270002","Brainerd, MN US":"CITY:US270003","Buffalo, MN US":"CITY:US270004","Duluth, MN US":"CITY:US270005","Fairmont, MN US":"CITY:US270006","Faribault, MN US":"CITY:US270007","Fergus Falls, MN US":"CITY:US270008","Hibbing, MN US":"CITY:US270009","Hutchinson, MN US":"CITY:US270010","Mankato, MN US":"CITY:US270011","Marshall, MN US":"CITY:US270012","Minneapolis, MN US":"CITY:US270013","New Ulm, MN US":"CITY:US270014","Owatonna, MN US":"CITY:US270015","Rochester, MN US":"CITY:US270016","Saint Paul, MN US":"CITY:US270017","St. Cloud, MN US":"CITY:US270018","Willmar, MN US":"CITY:US270019","Worthington, MN US":"CITY:US270020","Biloxi, MS US":"CITY:US280001","Clarksdale, MS US":"CITY:US280002","Cleveland, MS US":"CITY:US280003","Columbus, MS US":"CITY:US280004","Corinth, MS US":"CITY:US280005","Greenville, MS US":"CITY:US280006","Greenwood, MS US":"CITY:US280007","Grenada, MS US":"CITY:US280008","Gulfport, MS US":"CITY:US280009","Hattiesburg, MS US":"CITY:US280010","Jackson, MS US":"CITY:US280011","Laurel, MS US":"CITY:US280012","McComb, MS US":"CITY:US280013","Meridian, MS US":"CITY:US280014","Natchez, MS US":"CITY:US280015","Oxford, MS US":"CITY:US280016","Picayune, MS US":"CITY:US280017","Tupelo, MS US":"CITY:US280018","Vicksburg, MS US":"CITY:US280019","Yazoo City, MS US":"CITY:US280020","Cape Girardeau, MO US":"CITY:US290001","Columbia, MO US":"CITY:US290002","Excelsior Springs, MO US":"CITY:US290003","Farmington, MO US":"CITY:US290004","Fort Leonard Wood, MO US":"CITY:US290005","Jefferson City, MO US":"CITY:US290006","Joplin, MO US":"CITY:US290007","Kansas City, MO US":"CITY:US290008","Kennett, MO US":"CITY:US290009","Kirksville, MO US":"CITY:US290010","Lebanon, MO US":"CITY:US290011","Marshall, MO US":"CITY:US290012","Maryville, MO US":"CITY:US290013","Moberly, MO US":"CITY:US290014","Poplar Bluff, MO US":"CITY:US290015","Rolla, MO US":"CITY:US290016","Sedalia, MO US":"CITY:US290017","Sikeston, MO US":"CITY:US290018","Springfield, MO US":"CITY:US290019","St. Joseph, MO US":"CITY:US290020","St. Louis, MO US":"CITY:US290021","Warrensburg, MO US":"CITY:US290022","Washington, MO US":"CITY:US290023","West Plains, MO US":"CITY:US290024","Billings, MT US":"CITY:US300001","Bozeman, MT US":"CITY:US300002","Butte, MT US":"CITY:US300003","Great Falls, MT US":"CITY:US300004","Helena, MT US":"CITY:US300005","Kalispell, MT US":"CITY:US300006","Missoula, MT US":"CITY:US300007","Beatrice, NE US":"CITY:US310001","Columbus, NE US":"CITY:US310002","Fremont, NE US":"CITY:US310003","Grand Island, NE US":"CITY:US310004","Hastings, NE US":"CITY:US310005","Kearney, NE US":"CITY:US310006","Lexington, NE US":"CITY:US310007","Lincoln, NE US":"CITY:US310008","Norfolk, NE US":"CITY:US310009","North Platte, NE US":"CITY:US310010","Omaha, NE US":"CITY:US310011","Scottsbluff, NE US":"CITY:US310012","Boulder City, NV US":"CITY:US320001","Carson City, NV US":"CITY:US320002","Elko, NV US":"CITY:US320003","Las Vegas, NV US":"CITY:US320004","Pahrump, NV US":"CITY:US320005","Reno, NV US":"CITY:US320006","Berlin, NH US":"CITY:US330001","Claremont, NH US":"CITY:US330002","Concord, NH US":"CITY:US330003","Keene, NH US":"CITY:US330004","Laconia, NH US":"CITY:US330005","Manchester, NH US":"CITY:US330006","Nashua, NH US":"CITY:US330007","Portsmouth, NH US":"CITY:US330008","Rochester, NH US":"CITY:US330009","Jersey City, NJ US":"CITY:US340001","Lakewood, NJ US":"CITY:US340002","Newark, NJ US":"CITY:US340003","Pleasantville, NJ US":"CITY:US340004","Toms River, NJ US":"CITY:US340005","Trenton, NJ US":"CITY:US340006","Vineland, NJ US":"CITY:US340007","Alamogordo, NM US":"CITY:US350001","Albuquerque, NM US":"CITY:US350002","Carlsbad, NM US":"CITY:US350003","Clovis, NM US":"CITY:US350004","Deming, NM US":"CITY:US350005","Farmington, NM US":"CITY:US350006","Gallup, NM US":"CITY:US350007","Las Cruces, NM US":"CITY:US350008","Roswell, NM US":"CITY:US350009","Santa Fe, NM US":"CITY:US350010","Silver City, NM US":"CITY:US350011","Albany, NY US":"CITY:US360001","Amsterdam, NY US":"CITY:US360002","Binghamton, NY US":"CITY:US360003","Brentwood, NY US":"CITY:US360004","Brooklyn, NY US":"CITY:US360005","Buffalo, NY US":"CITY:US360006","Commack, NY US":"CITY:US360007","Coram, NY US":"CITY:US360008","Elmira, NY US":"CITY:US360009","Hempstead, NY US":"CITY:US360010","Huntington Station, NY US":"CITY:US360011","Ithaca, NY US":"CITY:US360012","Jamestown, NY US":"CITY:US360013","Kingston, NY US":"CITY:US360014","Levittown, NY US":"CITY:US360015","Massena, NY US":"CITY:US360016","Middletown, NY US":"CITY:US360017","New City, NY US":"CITY:US360018","New York, NY US":"CITY:US360019","Niagara Falls, NY US":"CITY:US360020","Ogdensburg, NY US":"CITY:US360021","Oneonta, NY US":"CITY:US360022","Oswego, NY US":"CITY:US360023","Plattsburgh, NY US":"CITY:US360024","Poughkeepsie, NY US":"CITY:US360025","Rochester, NY US":"CITY:US360026","Saratoga Springs, NY US":"CITY:US360027","Syracuse, NY US":"CITY:US360028","Utica, NY US":"CITY:US360029","Watertown, NY US":"CITY:US360030","Yonkers, NY US":"CITY:US360031","Asheboro, NC US":"CITY:US370001","Asheville, NC US":"CITY:US370002","Boone, NC US":"CITY:US370003","Burlington, NC US":"CITY:US370004","Charlotte, NC US":"CITY:US370005","Durham, NC US":"CITY:US370006","Elizabeth City, NC US":"CITY:US370007","Fayetteville, NC US":"CITY:US370008","Fort Bragg, NC US":"CITY:US370009","Gastonia, NC US":"CITY:US370010","Greensboro, NC US":"CITY:US370011","Greenville, NC US":"CITY:US370012","Hendersonville, NC US":"CITY:US370013","Hickory, NC US":"CITY:US370014","Jacksonville, NC US":"CITY:US370015","New Bern, NC US":"CITY:US370016","Raleigh, NC US":"CITY:US370017","Roanoke Rapids, NC US":"CITY:US370018","Rocky Mount, NC US":"CITY:US370019","Salisbury, NC US":"CITY:US370020","Statesville, NC US":"CITY:US370021","Wilmington, NC US":"CITY:US370022","Winston-Salem, NC US":"CITY:US370023","Bismarck, ND US":"CITY:US380001","Dickinson, ND US":"CITY:US380002","Fargo, ND US":"CITY:US380003","Grand Forks, ND US":"CITY:US380004","Jamestown, ND US":"CITY:US380005","Minot, ND US":"CITY:US380006","Williston, ND US":"CITY:US380007","Akron, OH US":"CITY:US390001","Ashland, OH US":"CITY:US390002","Ashtabula, OH US":"CITY:US390003","Athens, OH US":"CITY:US390004","Bowling Green, OH US":"CITY:US390005","Cambridge, OH US":"CITY:US390006","Canton, OH US":"CITY:US390007","Chillicothe, OH US":"CITY:US390008","Cincinnati, OH US":"CITY:US390009","Cleveland, OH US":"CITY:US390010","Columbus, OH US":"CITY:US390011","Dayton, OH US":"CITY:US390012","Defiance, OH US":"CITY:US390013","Delaware, OH US":"CITY:US390014","Lima, OH US":"CITY:US390015","Mansfield, OH US":"CITY:US390016","Marion, OH US":"CITY:US390017","Mentor, OH US":"CITY:US390018","New Philadelphia, OH US":"CITY:US390019","Newark, OH US":"CITY:US390020","Portsmouth, OH US":"CITY:US390021","Salem, OH US":"CITY:US390022","Sandusky, OH US":"CITY:US390023","Steubenville, OH US":"CITY:US390024","Toledo, OH US":"CITY:US390025","Urbana, OH US":"CITY:US390026","Wooster, OH US":"CITY:US390027","Youngstown, OH US":"CITY:US390028","Zanesville, OH US":"CITY:US390029","Ada, OK US":"CITY:US400001","Altus, OK US":"CITY:US400002","Ardmore, OK US":"CITY:US400003","Bartlesville, OK US":"CITY:US400004","Chickasha, OK US":"CITY:US400005","Durant, OK US":"CITY:US400006","Elk City, OK US":"CITY:US400007","Enid, OK US":"CITY:US400008","Guymon, OK US":"CITY:US400009","Lawton, OK US":"CITY:US400010","McAlester, OK US":"CITY:US400011","Muskogee, OK US":"CITY:US400012","Oklahoma City, OK US":"CITY:US400013","Okmulgee, OK US":"CITY:US400014","Ponca City, OK US":"CITY:US400015","Shawnee, OK US":"CITY:US400016","Stillwater, OK US":"CITY:US400017","Tahlequah, OK US":"CITY:US400018","Tulsa, OK US":"CITY:US400019","Woodward, OK US":"CITY:US400020","Bend, OR US":"CITY:US410001","City of The Dalles, OR US":"CITY:US410002","Coos Bay, OR US":"CITY:US410003","Corvallis, OR US":"CITY:US410004","Eugene, OR US":"CITY:US410005","Grants Pass, OR US":"CITY:US410006","Hermiston, OR US":"CITY:US410007","Hillsboro, OR US":"CITY:US410008","Klamath Falls, OR US":"CITY:US410009","La Grande, OR US":"CITY:US410010","Medford, OR US":"CITY:US410011","Ontario, OR US":"CITY:US410012","Pendleton, OR US":"CITY:US410013","Portland, OR US":"CITY:US410014","Roseburg, OR US":"CITY:US410015","Salem, OR US":"CITY:US410016","St. Helens, OR US":"CITY:US410017","Allentown, PA US":"CITY:US420001","Altoona, PA US":"CITY:US420002","Bethlehem, PA US":"CITY:US420003","Bloomsburg, PA US":"CITY:US420004","Chambersburg, PA US":"CITY:US420005","Chester, PA US":"CITY:US420006","Erie, PA US":"CITY:US420007","Hanover, PA US":"CITY:US420008","Harrisburg, PA US":"CITY:US420009","Hazleton, PA US":"CITY:US420010","Johnstown, PA US":"CITY:US420011","Lancaster, PA US":"CITY:US420012","Lebanon, PA US":"CITY:US420013","Meadville, PA US":"CITY:US420014","Philadelphia, PA US":"CITY:US420015","Pittsburgh, PA US":"CITY:US420016","Reading, PA US":"CITY:US420017","Scranton, PA US":"CITY:US420018","St. Marys, PA US":"CITY:US420019","State College, PA US":"CITY:US420020","Uniontown, PA US":"CITY:US420021","Wilkes-Barre, PA US":"CITY:US420022","Williamsport, PA US":"CITY:US420023","York, PA US":"CITY:US420024","Newport, RI US":"CITY:US440001","Providence, RI US":"CITY:US440002","Westerly, RI US":"CITY:US440003","Charleston, SC US":"CITY:US450001","Clemson, SC US":"CITY:US450002","Columbia, SC US":"CITY:US450003","Florence, SC US":"CITY:US450004","Greenville, SC US":"CITY:US450005","Greenwood, SC US":"CITY:US450006","Hilton Head Island, SC US":"CITY:US450007","Myrtle Beach, SC US":"CITY:US450008","Orangeburg, SC US":"CITY:US450009","Rock Hill, SC US":"CITY:US450010","Spartanburg, SC US":"CITY:US450011","Sumter, SC US":"CITY:US450012","Aberdeen, SD US":"CITY:US460001","Brookings, SD US":"CITY:US460002","Huron, SD US":"CITY:US460003","Mitchell, SD US":"CITY:US460004","Pierre, SD US":"CITY:US460005","Rapid City, SD US":"CITY:US460006","Sioux Falls, SD US":"CITY:US460007","Watertown, SD US":"CITY:US460008","Yankton, SD US":"CITY:US460009","Bristol, TN US":"CITY:US470001","Chattanooga, TN US":"CITY:US470002","Clarksville, TN US":"CITY:US470003","Columbia, TN US":"CITY:US470004","Cookeville, TN US":"CITY:US470005","Dyersburg, TN US":"CITY:US470006","Jackson, TN US":"CITY:US470007","Johnson City, TN US":"CITY:US470008","Kingsport, TN US":"CITY:US470009","Knoxville, TN US":"CITY:US470010","Lebanon, TN US":"CITY:US470011","McMinnville, TN US":"CITY:US470012","Memphis, TN US":"CITY:US470013","Morristown, TN US":"CITY:US470014","Murfreesboro, TN US":"CITY:US470015","Nashville, TN US":"CITY:US470016","Union City, TN US":"CITY:US470017","Abilene, TX US":"CITY:US480001","Amarillo, TX US":"CITY:US480002","Arlington, TX US":"CITY:US480003","Athens, TX US":"CITY:US480004","Austin, TX US":"CITY:US480005","Bay City, TX US":"CITY:US480006","Beaumont, TX US":"CITY:US480007","Beeville, TX US":"CITY:US480008","Brenham, TX US":"CITY:US480009","Brownsville, TX US":"CITY:US480010","Bryan, TX US":"CITY:US480011","College Station, TX US":"CITY:US480012","Conroe, TX US":"CITY:US480013","Corpus Christi, TX US":"CITY:US480014","Corsicana, TX US":"CITY:US480015","Dallas, TX US":"CITY:US480016","Del Rio, TX US":"CITY:US480017","Denton, TX US":"CITY:US480018","Eagle Pass, TX US":"CITY:US480019","El Campo, TX US":"CITY:US480020","El Paso, TX US":"CITY:US480021","Fort Hood, TX US":"CITY:US480022","Fort Worth, TX US":"CITY:US480023","Freeport, TX US":"CITY:US480024","Gainesville, TX US":"CITY:US480025","Galveston, TX US":"CITY:US480026","Gatesville, TX US":"CITY:US480027","Greenville, TX US":"CITY:US480028","Harlingen, TX US":"CITY:US480029","Henderson, TX US":"CITY:US480030","Houston, TX US":"CITY:US480031","Huntsville, TX US":"CITY:US480032","Irving, TX US":"CITY:US480033","Jacksonville, TX US":"CITY:US480034","Katy, TX US":"CITY:US480035","Kerrville, TX US":"CITY:US480036","Killeen, TX US":"CITY:US480037","Kingsville, TX US":"CITY:US480038","Lake Jackson, TX US":"CITY:US480039","Laredo, TX US":"CITY:US480040","Longview, TX US":"CITY:US480041","Lubbock, TX US":"CITY:US480042","Lufkin, TX US":"CITY:US480043","McAllen, TX US":"CITY:US480044","Midland, TX US":"CITY:US480045","Mineral Wells, TX US":"CITY:US480046","Mount Pleasant, TX US":"CITY:US480047","Nacogdoches, TX US":"CITY:US480048","New Braunfels, TX US":"CITY:US480049","Odessa, TX US":"CITY:US480050","Palestine, TX US":"CITY:US480051","Paris, TX US":"CITY:US480052","Plano, TX US":"CITY:US480053","Port Arthur, TX US":"CITY:US480054","Rio Grande City, TX US":"CITY:US480055","Round Rock, TX US":"CITY:US480056","San Antonio, TX US":"CITY:US480057","San Marcos, TX US":"CITY:US480058","Sherman, TX US":"CITY:US480059","Stephenville, TX US":"CITY:US480060","Sulphur Springs, TX US":"CITY:US480061","Texarkana, TX US":"CITY:US480062","The Woodlands, TX US":"CITY:US480063","Tyler, TX US":"CITY:US480064","Uvalde, TX US":"CITY:US480065","Vernon, TX US":"CITY:US480066","Victoria, TX US":"CITY:US480067","Waco, TX US":"CITY:US480068","Waxahachie, TX US":"CITY:US480069","Wichita Falls, TX US":"CITY:US480070","Brigham City, UT US":"CITY:US490001","Cedar City, UT US":"CITY:US490002","Logan, UT US":"CITY:US490003","Ogden, UT US":"CITY:US490004","Provo, UT US":"CITY:US490005","Salt Lake City, UT US":"CITY:US490006","St. George, UT US":"CITY:US490007","Burlington, VT US":"CITY:US500001","Montpelier, VT US":"CITY:US500002","Rutland, VT US":"CITY:US500003","Alexandria, VA US":"CITY:US510001","Arlington, VA US":"CITY:US510002","Blacksburg, VA US":"CITY:US510003","Centreville, VA US":"CITY:US510004","Charlottesville, VA US":"CITY:US510005","Chesapeake, VA US":"CITY:US510006","Danville, VA US":"CITY:US510007","Fredericksburg, VA US":"CITY:US510008","Hampton, VA US":"CITY:US510009","Harrisonburg, VA US":"CITY:US510010","Leesburg, VA US":"CITY:US510011","Lynchburg, VA US":"CITY:US510012","Newport News, VA US":"CITY:US510013","Norfolk, VA US":"CITY:US510014","Richmond, VA US":"CITY:US510015","Roanoke, VA US":"CITY:US510016","Virginia Beach, VA US":"CITY:US510017","Winchester, VA US":"CITY:US510018","Aberdeen, WA US":"CITY:US530001","Anacortes, WA US":"CITY:US530002","Bellevue, WA US":"CITY:US530003","Bellingham, WA US":"CITY:US530004","Bremerton, WA US":"CITY:US530005","Centralia, WA US":"CITY:US530006","Ellensburg, WA US":"CITY:US530007","Everett, WA US":"CITY:US530008","Federal Way, WA US":"CITY:US530009","Kennewick, WA US":"CITY:US530010","Moses Lake, WA US":"CITY:US530011","Mount Vernon, WA US":"CITY:US530012","Oak Harbor, WA US":"CITY:US530013","Olympia, WA US":"CITY:US530014","Port Angeles, WA US":"CITY:US530015","Pullman, WA US":"CITY:US530016","Redmond, WA US":"CITY:US530017","Seattle, WA US":"CITY:US530018","Spokane, WA US":"CITY:US530019","Sunnyside, WA US":"CITY:US530020","Tacoma, WA US":"CITY:US530021","Vancouver, WA US":"CITY:US530022","Walla Walla, WA US":"CITY:US530023","Wenatchee, WA US":"CITY:US530024","Yakima, WA US":"CITY:US530025","Beckley, WV US":"CITY:US540001","Bluefield, WV US":"CITY:US540002","Charleston, WV US":"CITY:US540003","Fairmont, WV US":"CITY:US540004","Huntington, WV US":"CITY:US540005","Martinsburg, WV US":"CITY:US540006","Morgantown, WV US":"CITY:US540007","Parkersburg, WV US":"CITY:US540008","Wheeling, WV US":"CITY:US540009","Eau Claire, WI US":"CITY:US550001","Green Bay, WI US":"CITY:US550002","Janesville, WI US":"CITY:US550003","Kenosha, WI US":"CITY:US550004","La Crosse, WI US":"CITY:US550005","Madison, WI US":"CITY:US550006","Manitowoc, WI US":"CITY:US550007","Marinette, WI US":"CITY:US550008","Milwaukee, WI US":"CITY:US550009","Oshkosh, WI US":"CITY:US550010","Racine, WI US":"CITY:US550011","River Falls, WI US":"CITY:US550012","Sheboygan, WI US":"CITY:US550013","Wausau, WI US":"CITY:US550014","Casper, WY US":"CITY:US560001","Cheyenne, WY US":"CITY:US560002","Evanston, WY US":"CITY:US560003","Gillette, WY US":"CITY:US560004","Laramie, WY US":"CITY:US560005","Rock Springs, WY US":"CITY:US560006","Sheridan, WY US":"CITY:US560007","Bobo Dioulasso, UV":"CITY:UV000002","Ouagadougou, UV":"CITY:UV000004","Ouahigouya, UV":"CITY:UV000005","Melo, UY":"CITY:UY000002","Montevideo, UY":"CITY:UY000003","Paysandu, UY":"CITY:UY000004","Rivera, UY":"CITY:UY000005","Salto, UY":"CITY:UY000006","Tacuarembo, UY":"CITY:UY000007","Andizhan, UZ":"CITY:UZ000001","Bukhara, UZ":"CITY:UZ000002","Dzhizak, UZ":"CITY:UZ000003","Fergana, UZ":"CITY:UZ000004","Gulistan, UZ":"CITY:UZ000005","Karshi, UZ":"CITY:UZ000006","Namangan, UZ":"CITY:UZ000007","Navoi, UZ":"CITY:UZ000008","Nukus, UZ":"CITY:UZ000009","Samarkand, UZ":"CITY:UZ000010","Tashkent, UZ":"CITY:UZ000011","Termez, UZ":"CITY:UZ000012","Urgench, UZ":"CITY:UZ000013","Barcelona, VE":"CITY:VE000001","Barquisimeto, VE":"CITY:VE000002","Caracas, VE":"CITY:VE000003","Ciudad Bolivar, VE":"CITY:VE000004","Coro, VE":"CITY:VE000005","Cumana, VE":"CITY:VE000006","Guanare, VE":"CITY:VE000007","Maracaibo, VE":"CITY:VE000008","Maturin, VE":"CITY:VE000009","Merida, VE":"CITY:VE000010","Puerto Ayacucho, VE":"CITY:VE000011","Puerto La Cruz, VE":"CITY:VE000012","San Carlos, VE":"CITY:VE000013","San Cristobal, VE":"CITY:VE000014","San Felipe, VE":"CITY:VE000015","San Juan De Los Morros, VE":"CITY:VE000017","Valencia, VE":"CITY:VE000019","Bien Hoa, VM":"CITY:VM000002","Buon Me Thuot, VM":"CITY:VM000003","Can Tho, VM":"CITY:VM000004","Da Lat, VM":"CITY:VM000005","Da Nang, VM":"CITY:VM000006","Haiphong, VM":"CITY:VM000008","Hanoi, VM":"CITY:VM000009","Ho Chi Minh City, VM":"CITY:VM000010","Hue, VM":"CITY:VM000013","My Tho, VM":"CITY:VM000015","Nha Trang, VM":"CITY:VM000016","Phan Thiet, VM":"CITY:VM000017","Play Cu, VM":"CITY:VM000019","Qui Nhon, VM":"CITY:VM000020","Soc Trang, VM":"CITY:VM000022","Tan An, VM":"CITY:VM000023","Thanh Hoa, VM":"CITY:VM000026","Truc Giang, VM":"CITY:VM000028","Tuy Hoa, VM":"CITY:VM000029","Vinh Long, VM":"CITY:VM000031","Walvis Bay, WA":"CITY:WA000001","Windhoek, WA":"CITY:WA000002","Manzini, WZ":"CITY:WZ000001","Mbabane, WZ":"CITY:WZ000002","Chipata, ZA":"CITY:ZA000001","Kabwe, ZA":"CITY:ZA000002","Kasama, ZA":"CITY:ZA000003","Livingstone, ZA":"CITY:ZA000004","Lusaka, ZA":"CITY:ZA000005","Mongu, ZA":"CITY:ZA000006","Ndola, ZA":"CITY:ZA000007","Bulawayo, ZI":"CITY:ZI000001","Gweru, ZI":"CITY:ZI000002","Harare, ZI":"CITY:ZI000003","Masvingo, ZI":"CITY:ZI000004"};

function fetchCurrentLocation() {
	if (!current_location && !ip_request) {
		var ip_location_url = 'freegeo_ip.json'; //'https://freegeoip.net/json/';

		ip_request = new XMLHttpRequest();
		ip_request.open('GET', ip_location_url, true);

		ip_request.onload = function() {
		  if (ip_request.status >= 200 && ip_request.status < 400) {
		    processCurrentLocation(JSON.parse(ip_request.responseText));
		  }
		  else {
		    alert('could not reach ip location url');
		  }
		};
		ip_request.onerror = function() {
		  alert('could not reach ip location url');
		};

		ip_request.send();
	}
}

function fetchAirportLocations() {
	if (!airport_locations && !airport_locations_request) {
		var airport_locations_url = 'airport_locations.json';

		airport_locations_request = new XMLHttpRequest();
		airport_locations_request.open('GET', airport_locations_url, true);

		airport_locations_request.onload = function() {
			if (airport_locations_request.status >= 200 && airport_locations_request.status < 400) {
				processAirportLocations(JSON.parse(airport_locations_request.responseText));
			}
			else {
				alert('could not reach airport locations url');
			}
		};
		airport_locations_request.onerror = function() {
		  	alert('could not reach airport locations url');
		};

		airport_locations_request.send();
	}
}

function fetchNearestAirports(latitude, longitude) {
	if (!nearest_airports && !nearest_airports_request) {
		var nearest_airports_url = 'nearest_airports.json';

		nearest_airports_request = new XMLHttpRequest();
		nearest_airports_request.open('GET', nearest_airports_url + '?latitude=' + latitude + '&longitude=' + longitude, true);

		nearest_airports_request.onload = function() {
			if (nearest_airports_request.status >= 200 && nearest_airports_request.status < 400) {
				processNearestAirports(JSON.parse(nearest_airports_request.responseText));
			}
			else {
				alert('could not reach airport locations url');
			}
		};
		nearest_airports_request.onerror = function() {
		  	alert('could not reach airport locations url');
		};

		nearest_airports_request.send();
	}
}

function fetchCheapestFlights(from_airport, to_airport) {
	from_airport = from_airport.toLowerCase();
	to_airport = to_airport.toLowerCase();

	var cache_key = from_airport + '_' + to_airport;

	if (!flight_lookup_cache[cache_key]) {
		var flight_lookup_url = 'http://beta.flightkitty.com/tnooz?from=' + from_airport + '&to=' + to_airport;

		if (cheapest_flights_request) {
			cheapest_flights_request.abort();
		}

		cheapest_flights_request = new XMLHttpRequest();
		cheapest_flights_request.open('GET', flight_lookup_url, true);

		cheapest_flights_request.onload = function() {
			if (cheapest_flights_request.status >= 200 && cheapest_flights_request.status < 400) {
				var obj = JSON.parse(cheapest_flights_request.responseText);
				flight_lookup_cache[cache_key] = obj
				processCheapestFlights(obj);
			}
			else {
				alert('could not reach cheapest flights url ahhh');
			}
		};
		cheapest_flights_request.onerror = function() {
		  	alert('could not reach cheapest flights url');
		};

		cheapest_flights_request.send();
	}
	else {
		processCheapestFlights(flight_lookup_cache[cache_key]);
	}
}

function processCurrentLocation(json) {
	current_location = {
		city: json.city,
		country_code: json.country_code,
		latitude: json.latitude,
		longitude: json.longitude
	};

	fetchNearestAirports(json.latitude, json.longitude);
	fetchAirportLocations();
}

function processNearestAirports(json) {
	nearest_airports = json;
}

function processCheapestFlights(json) {
	var results_container = document.getElementById(results_container_id);

	results_container.innerHTML = '';

	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	var max_price = 0;
	var min_price = Number.POSITIVE_INFINITY;

	json.forEach(function(month_data) {
		max_price = Math.max(max_price, Number(month_data.price));
		min_price = Math.min(min_price, Number(month_data.price));
	});

	var month_price_container = document.createElement('div');
	month_price_container.id = 'tnooz_month_price_container';
	var max_width = 16.6;

	json.forEach(function(month_data) {
		var month_div = document.createElement('div');
		var month_span = document.createElement('span');
		var month_label = document.createElement('span');

		var percent = 100 * (1 - Number(month_data.price) / max_price);
		var popularity = month_data.popularity;

		month_span.style.height = percent + '%';
		
		if (popularity >= 0.75) {
			month_div.classList.add('high');
		}
		else if (popularity <= 0.25) {
			month_div.classList.add('low');
		}
		else {
			month_div.classList.add('medium');
		}

		month_span.classList.add('negative_month');

		var date_parts = month_data.month.split('-');

		month_label.classList.add('label');
		month_label.innerHTML = '$' + Math.round(Number(month_data.price)) + '<br>' + months[Number(date_parts[1]) - 1];

		month_div.appendChild(month_span);
		month_div.appendChild(month_label);
		month_price_container.appendChild(month_div);
	});

	selected_price_container = document.createElement('div');
	selected_price_container.classList.add('price');
	selected_price_container.innerHTML = 'From <span>$' + Math.round(min_price) + '</span>';

	results_container.appendChild(selected_price_container)
	results_container.appendChild(month_price_container);
}

function distance(dx, dy) {
	return Math.sqrt(dx * dx + dy * dy);
}

function processAirportLocations(cities) {
	var popular_dictionary = [];
	var first_word_dictionary = [];

	cities.forEach(function (city_info) {
		if (distance(city_info.Lat - current_location.latitude, city_info.Long - current_location.longitude) > 3) {
			if (!popular_dictionary[city_info.City]) {
				popular_dictionary[city_info.City] = city_info;
			}
		}
	});

	for (var city_name in popular_dictionary) {
		if (popular_dictionary.hasOwnProperty(city_name)) {
			var first_word = popular_dictionary[city_name].City.split(' ').shift();

			if (!first_word_dictionary[first_word]) {
				first_word_dictionary[first_word] = [];
			}

			first_word_dictionary[first_word].push(popular_dictionary[city_name]);
		}
	}

	var paragraphs = document.querySelectorAll('p');

	[].forEach.call(paragraphs, function(p) {
		var textNodes = p.childNodes;
		
		traverseChildNodes(p, first_word_dictionary);

		var links = p.querySelectorAll('a.tnooz_flightfinder_icon');

		[].forEach.call(links, function(a) {
			a.addEventListener('mouseover', hoverLocation);
			a.addEventListener('mouseout', leaveLocation);
		});
	});

	airport_locations = popular_dictionary;
}

function traverseChildNodes(node, first_word_dictionary) {
 
    var next;
 
    if (node.nodeType === 1 && node.tagName === 'P') {
        if (node = node.firstChild) {
            do {
                // Recursively call traverseChildNodes
                // on each child node
                next = node.nextSibling;
                traverseChildNodes(node, first_word_dictionary);
            } while(node = next);
        }
 
    }
    else if (node.nodeType === 3) {
    	var matching_regexes = [];
    	var node_data = node.data;

    	for (var city_first in first_word_dictionary) {

        	if (first_word_dictionary.hasOwnProperty(city_first)) {
        		/*
        		Possibilities:
        		San => [San Francisco, San Diego, San Jose]

        		Portland => [Portland]
        		 */
        		var lookahead = '(?=([\\s\\n\\r]+[a-z]|[\\s\\n\\r]*$|,))';
        		
    			// if there's only one word in the city name
    			// we know there's only one entry in the first_word_dictionary[city_first] array
    			if (first_word_dictionary[city_first].length === 1) {
    				var first_word_regex = new RegExp('\\b' + city_first + lookahead);

	        		if (first_word_regex.test(node_data)) {  
        				var city_info = first_word_dictionary[city_first][0];

        				matching_regexes.push(first_word_regex);

						delete first_word_dictionary[city_first];
    				}
    			}
    			else {
    				var first_word_regex = new RegExp('\\b' + city_first + '\\b');

	        		if (first_word_regex.test(node_data)) {    

	    				for (var c = 0; c < first_word_dictionary[city_first].length; c++) {
	        				var city_info = first_word_dictionary[city_first][c];
	    						
							var has_replaced = false;

							var full_name_regex = new RegExp('\\b' + city_info.City.split(' ').join('[\\s\\n\\r]+') + lookahead);

							if (full_name_regex.test(node_data)) {
								matching_regexes.push(full_name_regex);

	    						first_word_dictionary[city_first].splice(c, 1);
	    						c--;
							}
	        			}
	        		}
    			}
        	}
        }

        if (matching_regexes.length) {
        	wrapMatchesInNode(node, matching_regexes);
        }
    }
}

function hoverLocation() {
	if (window.getSelection().type !== 'None' && !window.getSelection().isCollapsed) {
		console.log('things are selected', window.getSelection());
		return;
	}

	var boundRect = this.getBoundingClientRect();

	var container_div = document.getElementById(container_id);
	container_div.classList.add('hovered');

	var location = this.getAttribute('data-location');

	var city_info = airport_locations[location];

	container_div.style.left = Math.max(0, boundRect.left - 20);
	container_div.style.top = boundRect.bottom;

	insertAfter(container_div, this.parentNode);

	if (nearest_airports) {
		renderOverlayContent(city_info);
	}
}

function leaveLocation() {
	var boundRect = this.getBoundingClientRect();
	if (window.event.clientX < boundRect.left ||
		window.event.clientX > boundRect.right ||
		window.event.clientY < boundRect.bottom
	) {
		var container_div = document.getElementById(container_id);
		container_div.classList.remove('hovered');
	}
}

function getParents(elem) {
    var parents = [];

    for ( ; elem && elem !== document; elem = elem.parentNode ) {
		parents.push( elem );
    }

    return parents;
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function wrapMatchesInNode(textNode, matching_regexes) {
 
	var temp = document.createElement('div');

	temp.innerHTML = textNode.data;

	matching_regexes.forEach(function(matching_regex) {
		temp.innerHTML = temp.innerHTML.replace(matching_regex, '<span style="display:inline-block">$&<a href="javascript:void(0)" data-location="$&" class="tnooz_flightfinder_icon">&#9992;</a></span>');
	});
	
	while (temp.firstChild) {
	    textNode.parentNode.insertBefore(temp.firstChild, textNode);
	}

	textNode.parentNode.removeChild(textNode);
}

function addStyles() {
	var style = document.createElement('link');

	style.type = 'text/css';
	style.rel = 'stylesheet';
	style.media = 'screen';
	style.href = 'overlay.css';

	document.head.appendChild(style);
}

function renderOverlay() {
	var container_div = document.createElement('div');
	container_div.id = container_id;

	container_div.classList.add('flight_overlay');
	container_div.addEventListener('mouseout', function(e) {
		var to_parents = getParents(e.toElement);
		if(!to_parents.includes(this) && e.toElement !== this) {
			container_div.classList.remove('hovered');
		}
	});

	document.body.appendChild(container_div);
}

function renderOverlayContent(city_info) {
	var container_div = document.getElementById(container_id);

	container_div.innerHTML = '';

	var header_container = document.createElement('div');
	header_container.classList.add('header_container');

	var current_location_span = document.createElement('span');
	current_location_span.classList.add('current_location');

	var destination_select = document.createElement('select');
	var from_select = document.createElement('select');

	current_location_span.textContent = current_location.city;

	var to_span = document.createElement('span');
	to_span.classList.add('to');
	to_span.textContent = ' to ';

	var current_div = document.createElement('div');
	var destination_div = document.createElement('div');

	var destination_span = document.createElement('span');
	destination_span.classList.add('destination');

	destination_span.textContent = city_info.City;

	if (city_info.CountryCode !== current_location.country_code) {
		destination_span.textContent += ', ' + city_info.Country;
	}

	current_div.appendChild(current_location_span);

	destination_div.appendChild(to_span);
	destination_div.appendChild(destination_span);

	if (nearest_airports.length > 1) {
		nearest_airports.forEach(function(airport) {
			var option = document.createElement('option');
			option.text = airport;
			if (current_location.preferred_airport === airport) {
				option.selected = true;
			}
			from_select.appendChild(option);
		});

		current_div.appendChild(from_select);

		from_select.addEventListener('change', function() {
			current_location.preferred_airport = this.value;
			fetchCheapestFlights(this.value, city_info.Airports.length > 1 ? destination_select.value : city_info.Airports[0]);
		});
	}
	else {
		var location_airport_span = document.createElement('span');
		location_airport_span.textContent = ' (' + nearest_airports[0] + ')';
		current_div.appendChild(location_airport_span);
	}

	if (city_info.Airports.length > 1) {
		city_info.Airports.forEach(function(airport) {
			var option = document.createElement('option');
			option.text = airport;
			if (city_info.preferred_airport === airport) {
				option.selected = true;
			}
			destination_select.appendChild(option);
		});

		destination_span.appendChild(destination_select);

		destination_select.addEventListener('change', function() {
			city_info.preferred_airport = this.value;
			fetchCheapestFlights(nearest_airports.length > 1 ? from_select.value : nearest_airports[0], this.value);
		});
	}
 	else {
 		var destination_airport_span = document.createElement('span');
		destination_airport_span.textContent = ' (' + city_info.Airports[0] + ')';
		destination_div.appendChild(destination_airport_span);
 	}

	header_container.appendChild(current_div);
	header_container.appendChild(destination_div);

	container_div.appendChild(header_container);

	var results_container = document.createElement('div');
	results_container.id = results_container_id;

	container_div.appendChild(results_container);

	fetchCheapestFlights(
		nearest_airports.length > 1 ? from_select.value : nearest_airports[0],
		city_info.Airports.length > 1 ? destination_select.value : city_info.Airports[0]
	);
}

window.addEventListener('resize', function() {
	var container_div = document.getElementById(container_id);
	container_div.classList.remove(container_div);
});

fetchCurrentLocation();
addStyles();
renderOverlay();
