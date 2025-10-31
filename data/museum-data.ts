import type { ExhibitData, RoomQuiz } from "@/types/museum";

export const museumData: ExhibitData[] = [
  {
    id: "room1-exhibit1",
    title: "Cuộc tập kích chiến lược của Mỹ tháng 12/1972",
    position: { x: 300, y: 300 },
    roomNumber: 1,
    image: "/pic/r1-e1.webp",
    content: `Tháng 12 năm 1972, Mỹ mở cuộc tập kích chiến lược bằng máy bay B-52 quy mô lớn nhất trong Chiến tranh Việt Nam, nhằm buộc Việt Nam Dân chủ Cộng hòa phải khuất phục trên bàn đàm phán Paris.
Trong 12 ngày đêm khói lửa, Thủ đô Hà Nội cùng Hải Phòng và các địa phương miền Bắc trở thành trọng điểm ném bom ác liệt. Máy bay B-52 và F-111 liên tiếp trút bom xuống khu dân cư, bệnh viện, trường học, ga Hàng Cỏ, phố Khâm Thiên…
Tuy nhiên, với ý chí kiên cường và tinh thần “Quyết tử cho Tổ quốc quyết sinh”, quân dân miền Bắc, đặc biệt là lực lượng Phòng không – Không quân, đã bắn rơi 81 máy bay Mỹ, trong đó có 34 chiếc B-52, làm nên chiến thắng vang dội “Điện Biên Phủ trên không”.
Chiến thắng này buộc Mỹ phải ký Hiệp định Paris ngày 27/1/1973, chấm dứt chiến tranh, lập lại hòa bình ở Việt Nam.`,
  },
  {
    id: "room1-exhibit2",
    title: "Kế hoạch tấn công của Nixon và khởi đầu không kích",
    position: { x: 300, y: 600 },
    roomNumber: 1,
    image: "/pic/r1-e2.jpg",
    content: `Ngày 14 tháng 12 năm 1972, Tổng thống Nixon đã phê duyệt kế hoạch tấn công bằng đường không vào Hà Nội và Hải Phòng.
Không quân Hoa Kỳ tiến hành các cuộc không kích bằng máy bay ném bom chiến lược B-52 Stratofortress, tầm xa, siêu thanh, động cơ phản lực. Trong ảnh, máy bay ném bom B-52 đã phá hủy hoàn toàn Bệnh viện Bạch Mai ở Hà Nội.`,
  },
  {
    id: "room2-exhibit1",
    title: "Tấn công Đài Tiếng nói Việt Nam và thiệt hại cơ sở hạ tầng",
    position: { x: 300, y: 900 },
    roomNumber: 2,
    image: "/pic/r2-e1.png",
    content: `Đài phát thanh Mễ Trì của Đài Tiếng nói Việt Nam (VOV) bị tấn công vào đêm 18 tháng 12. Mặc dù thiệt hại về tài sản nặng nề, VOV vẫn tiếp tục phát sóng sau 9 phút im lặng.
Các cuộc không kích nhắm vào các mục tiêu dân sự, gây thiệt hại nghiêm trọng cho cơ sở hạ tầng và đời sống nhân dân miền Bắc.`,
  },
  {
    id: "room2-exhibit2",
    title: "Thảm họa phố Khâm Thiên và mất mát sinh mạng",
    position: { x: 700, y: 600 },
    roomNumber: 2,
    image: "/pic/r2-e2.jpg",
    content: `Phố Khâm Thiên ở Hà Nội bị đổ nát vào đêm ngày 26 tháng 12. Tổng cộng có 278 người thiệt mạng, chủ yếu là phụ nữ, người già và trẻ em.
Bom đạn Mỹ đã tàn phá nặng nề khu dân cư đông đúc, để lại nỗi đau thương lớn lao cho nhân dân Thủ đô.`,
  },
  {
    id: "room3-exhibit1",
    title: "Sơ tán dân cư và xây dựng hầm trú ẩn",
    position: { x: 1300, y: 300 },
    roomNumber: 3,
    image: "/pic/r3-e1.jpg",
    content: `Người dân đã được sơ tán đến nơi an toàn.
Các hầm trú bom ven đường cá nhân được dựng lên dọc theo các con phố.
Dù đối mặt với bom đạn ác liệt, nhân dân Hà Nội vẫn thể hiện tinh thần kiên cường, tổ chức sơ tán và trú ẩn hiệu quả để bảo vệ tính mạng.`,
  },
  {
    id: "room3-exhibit2",
    title: "Sự kháng cự anh dũng của quân dân miền Bắc",
    position: { x: 1300, y: 600 },
    roomNumber: 3,
    image: "/pic/r3-e2.jpg",
    content: `Các cuộc không kích của Mỹ đã vấp phải sự kháng cự mạnh mẽ của người dân Việt Nam. Trong ảnh, lính pháo binh đang trực chiến.
Đơn vị không quân Sao Đỏ đã góp phần vào chiến thắng của trận chiến.
Quân và dân ta ngày đêm sẵn sàng chiến đấu, bảo vệ bầu trời Tổ quốc với quyết tâm sắt đá.`,
  },
  {
    id: "room4-exhibit1",
    title: "Anh hùng Phạm Tuân và các chiến công bắn rơi B-52",
    position: { x: 1700, y: 300 },
    roomNumber: 4,
    image: "/pic/r4-e1.jpg",
    content: `Anh hùng Phạm Tuân lái máy bay MiG-21 bắn rơi máy bay ném bom B-52.
Một phi công Mỹ bị bắt trên hồ Trúc Bạch ở Hà Nội.
Bữa ăn hàng ngày của các phi công bị bắt tại Nhà tù Hỏa Lò ở Hà Nội.
Các anh hùng lực lượng Phòng không - Không quân đã lập nên kỳ tích, bắn rơi hàng loạt máy bay Mỹ, góp phần quyết định vào thắng lợi chung.`,
  },
  {
    id: "room4-exhibit2",
    title: "Chiến thắng 'Điện Biên Phủ trên không' và Hiệp định Paris",
    position: { x: 1700, y: 600 },
    roomNumber: 4,
    image: "/pic/r4-e2.jpg",
    content: `Thất bại của các cuộc không kích đã buộc Mỹ và tay sai phải ngồi vào bàn đàm phán năm 1973 và ký Hiệp định Paris, chấm dứt chiến tranh ở Việt Nam. Trong ảnh, bà Nguyễn Thị Bình, Bộ trưởng Ngoại giao Chính phủ Cách mạng Lâm thời Cộng hòa miền Nam Việt Nam, đã ký hiệp định vào ngày 27 tháng 1 năm 1973.
Xác máy bay ném bom B-52, trung tâm thành phố Hà Nội, Việt Nam.
Chiến thắng vang dội này không chỉ bảo vệ miền Bắc mà còn mở đường cho cuộc tổng tiến công mùa Xuân 1975, thống nhất đất nước.`,
  },
];

export const roomQuizzes: RoomQuiz[] = [
  {
    roomNumber: 1,
    questions: [
      {
        question:
          "Sau Cách mạng Tháng Tám năm 1945, chế độ chính trị nào được xác lập ở Việt Nam?",
        options: [
          "Chế độ dân chủ nhân dân",
          "Chế độ quân chủ lập hiến",
          "Chế độ phong kiến cải lương",
          "Chế độ tư sản dân quyền",
        ],
        correctAnswer: 0,
      },
      {
        question:
          "Sau khi thống nhất đất nước năm 1976, tên nước chính thức của Việt Nam là gì?",
        options: [
          "Việt Nam Dân chủ Cộng hòa",
          "Cộng hòa xã hội chủ nghĩa Việt Nam",
          "Liên bang Việt Nam",
          "Cộng hòa Việt Nam",
        ],
        correctAnswer: 1,
      },
      {
        question:
          "Đại hội nào của Đảng khởi xướng công cuộc Đổi mới và nhấn mạnh phát huy dân chủ?",
        options: [
          "Đại hội V",
          "Đại hội VI (1986)",
          "Đại hội VII",
          "Đại hội VIII",
        ],
        correctAnswer: 1,
      },
      {
        question:
          "Theo Đảng ta, dân chủ xã hội chủ nghĩa là bản chất của chế độ ta, đồng thời còn là gì?",
        options: [
          "Công cụ đấu tranh chính trị",
          "Mục tiêu và động lực phát triển đất nước",
          "Biểu hiện của kinh tế thị trường",
          "Cơ chế quản lý tập trung",
        ],
        correctAnswer: 1,
      },
      {
        question:
          "Để dân chủ phát huy hiệu quả, cần gắn liền với yếu tố nào sau đây?",
        options: [
          "Kỷ luật, kỷ cương và pháp luật (thể chế hóa)",
          "Tập quán địa phương",
          "Tình cảm xã hội",
          "Truyền thống gia đình",
        ],
        correctAnswer: 0,
      },
    ],
  },
  {
    roomNumber: 2,
    questions: [
      {
        question: "Bản chất của nền dân chủ xã hội chủ nghĩa ở Việt Nam là gì?",
        options: [
          "Dân chủ do cá nhân lãnh đạo",
          "Dân chủ do nhân dân làm chủ, quyền lực thuộc về nhân dân",
          "Dân chủ dựa vào giai cấp tư sản",
          "Dân chủ tập trung vào nhà nước",
        ],
        correctAnswer: 1,
      },
      {
        question:
          "Tư tưởng Hồ Chí Minh về dân chủ thể hiện rõ nhất qua câu nói nào sau đây?",
        options: [
          "Dân chủ là để dân bàn việc của dân",
          "Nước ta là nước dân chủ, bao nhiêu lợi ích đều vì dân, bao nhiêu quyền hạn đều là của dân",
          "Nhà nước là công cụ của Đảng",
          "Nhân dân là đối tượng quản lý của Nhà nước",
        ],
        correctAnswer: 1,
      },
      {
        question:
          "Dân chủ gián tiếp ở nước ta được thể hiện chủ yếu thông qua cơ quan nào?",
        options: [
          "Quốc hội và Hội đồng nhân dân các cấp",
          "Chính phủ và các bộ ngành",
          "Mặt trận Tổ quốc Việt Nam",
          "Tổ chức Đảng và Đoàn thể",
        ],
        correctAnswer: 0,
      },
      {
        question:
          "Hình thức dân chủ trực tiếp được nhân dân thể hiện bằng cách nào?",
        options: [
          "Tham gia bầu cử, giám sát, phản biện, kiểm tra hoạt động của Nhà nước",
          "Chỉ thông qua ý kiến gửi Đảng và Quốc hội",
          "Qua mạng xã hội và báo chí",
          "Qua đóng góp tài chính vào ngân sách",
        ],
        correctAnswer: 0,
      },
      {
        question: "Phương châm cơ bản trong thực hiện dân chủ ở cơ sở là gì?",
        options: [
          "Dân biết, dân bàn, dân làm, dân kiểm tra",
          "Dân hỏi – chính quyền trả lời",
          "Đảng quyết – dân làm",
          "Nhà nước làm – dân giám sát",
        ],
        correctAnswer: 0,
      },
    ],
  },
  {
    roomNumber: 3,
    questions: [
      {
        question:
          "Thượng tôn pháp luật trong Nhà nước pháp quyền xã hội chủ nghĩa có nghĩa là gì?",
        options: [
          "Pháp luật giữ vị trí tối thượng, điều chỉnh mọi quan hệ xã hội",
          "Pháp luật phụ thuộc vào ý chí của Đảng",
          "Mỗi địa phương có thể tự ra luật riêng",
          "Luật chỉ áp dụng cho cơ quan nhà nước",
        ],
        correctAnswer: 0,
      },
      {
        question: "Quyền lực nhà nước ở Việt Nam được tổ chức như thế nào?",
        options: [
          "Thống nhất quyền lực, có sự phân công – phối hợp – kiểm soát giữa lập pháp, hành pháp, tư pháp",
          "Phân lập cứng ba quyền, không phối hợp",
          "Tập trung tuyệt đối vào hành pháp",
          "Do Quốc hội nắm toàn bộ quyền lực",
        ],
        correctAnswer: 0,
      },
      {
        question:
          "Nhà nước pháp quyền xã hội chủ nghĩa Việt Nam đặt dưới sự lãnh đạo của ai?",
        options: [
          "Chính phủ",
          "Quốc hội",
          "Đảng Cộng sản Việt Nam",
          "Nhân dân địa phương",
        ],
        correctAnswer: 2,
      },
      {
        question:
          "Đặc trưng nổi bật của Nhà nước pháp quyền xã hội chủ nghĩa Việt Nam là gì?",
        options: [
          "Tôn trọng và bảo vệ quyền con người, coi con người là trung tâm của sự phát triển",
          "Tập trung mọi quyền vào một cơ quan duy nhất",
          "Không có sự kiểm soát quyền lực",
          "Phân quyền tuyệt đối giữa các cấp",
        ],
        correctAnswer: 0,
      },
      {
        question:
          "Đấu tranh phòng, chống tham nhũng và thực hành tiết kiệm nhằm mục tiêu gì?",
        options: [
          "Tăng nguồn thu ngân sách",
          "Giữ vững kỷ cương, củng cố niềm tin của nhân dân và nâng cao hiệu lực của Nhà nước pháp quyền",
          "Giảm chi phí hành chính",
          "Tạo hình ảnh tốt với quốc tế",
        ],
        correctAnswer: 1,
      },
    ],
  },
];
