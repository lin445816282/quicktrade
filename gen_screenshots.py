from PIL import Image, ImageDraw
import os

W, H = 1080, 1920
OUT = '/mnt/d/QuickTrade/screenshots'

def save(img, name):
    path = os.path.join(OUT, name)
    img.save(path, 'PNG')
    kb = os.path.getsize(path) // 1024
    print(f'  {name}  {kb}KB')

# ====== 1. 首页 ======
img = Image.new('RGB', (W, H), '#f5f5f5')
d = ImageDraw.Draw(img)

# 顶部栏
d.rectangle([0, 0, W, 80], fill='#fff')
d.text((30, 20), '👤 小林', fill='#666', font_size=36)
d.rectangle([W//2-170, 12, W//2+170, 58], outline='#d4a017', width=3)
d.text((W//2-155, 18), '2026-08-01 14:30', fill='#333', font_size=32)
d.text((W-180, 20), '退出', fill='#e74c3c', font_size=36)
d.line([0, 78, W, 78], fill='#f0f0f0', width=2)

# 今日汇总
d.rounded_rectangle([40, 100, W-40, 260], radius=24, fill='#fff')
d.text((60, 118), '今日支出', fill='#999', font_size=26)
d.text((60, 155), '¥128.50', fill='#e74c3c', font_size=50)
d.text((W//2-40, 118), '今日收入', fill='#999', font_size=26)
d.text((W//2-40, 155), '¥5,600', fill='#27ae60', font_size=50)
d.text((W-280, 118), '今日净额', fill='#999', font_size=26)
d.text((W-280, 155), '¥5,471.50', fill='#333', font_size=50)

# 交易列表
txs = [('🍜','餐饮','午饭','-¥42.00'), ('🚗','交通','打车','-¥28.50'),
       ('💵','工资','7月薪资','+¥5,600.00'), ('🛍️','购物','日用品','-¥58.00')]
for i, (icon, cat, note, amt) in enumerate(txs):
    y = 280 + i * 108
    d.rounded_rectangle([40, y, W-40, y+96], radius=12, fill='#fff')
    d.text((60, y+20), icon, font_size=46)
    d.text((140, y+16), cat, fill='#333', font_size=34)
    d.text((140, y+58), note, fill='#999', font_size=26)
    c = '#27ae60' if '+' in amt else '#e74c3c'
    d.text((W-40-len(amt)*20, y+26), amt, fill=c, font_size=38)

# 底部 + 按钮
d.rectangle([0, H-120, W, H], fill='#fff')
d.ellipse([W//2-56, H-110, W//2+56, H-8], fill='#e74c3c')
d.text((W//2-14, H-82), '+', fill='#fff', font_size=56)
d.text((80, H-60), '📊', font_size=44)
d.text((W-120, H-60), '⚙️', font_size=44)

save(img, '01_home.png')

# ====== 2. 记账页 ======
img2 = Image.new('RGB', (W, H), '#f5f5f5')
d2 = ImageDraw.Draw(img2)
d2.rectangle([0, 0, W, 80], fill='#fff')
d2.text((30, 20), '←', fill='#999', font_size=42)
d2.text((W//2-90, 18), '📝 记一笔', fill='#333', font_size=38)
d2.line([0, 78, W, 78], fill='#f0f0f0', width=2)

# 支出/收入切换
d2.rounded_rectangle([40, 100, W//2-70, 140], radius=18, fill='#e74c3c')
d2.text((W//4-90, 106), '支出', fill='#fff', font_size=30)
d2.rounded_rectangle([W//2+30, 100, W-40, 140], radius=18, fill='#f0f0f0')
d2.text((W//2+W//4-80, 106), '收入', fill='#999', font_size=30)

# 品类网格
cats = [('🍜','餐饮'),('🚗','交通'),('🛍️','购物'),('🧴','日用'),('🎮','娱乐'),
        ('📱','通讯'),('🏠','居住'),('💊','医疗'),('📚','教育'),('📌','其他')]
for i, (icon, name) in enumerate(cats):
    col = i % 5
    row = i // 5
    x = 40 + col * 200
    y = 160 + row * 140
    d2.rounded_rectangle([x, y, x+184, y+124], radius=12, outline='#eee', width=2, fill='#fff')
    d2.text((x+65, y+16), icon, font_size=48)
    d2.text((x+62, y+80), name, fill='#666', font_size=26)

# 金额
d2.text((60, 500), '¥0', fill='#333', font_size=64)

# 备注
d2.rounded_rectangle([40, 590, W-40, 660], radius=10, fill='#f5f5f5')
d2.text((60, 608), '添加备注...', fill='#ccc', font_size=30)

# 数字键盘
keys = [['1','2','3'],['4','5','6'],['7','8','9'],['.','0','⌫']]
for row_i, row_keys in enumerate(keys):
    for col_i, key in enumerate(row_keys):
        x = 40 + col_i * 340
        y = 700 + row_i * 120
        d2.rounded_rectangle([x, y, x+320, y+108], radius=14, fill='#fff')
        d2.text((x+130, y+20), key, fill='#333' if key != '⌫' else '#e74c3c', font_size=44)

# 保存
d2.rounded_rectangle([40, 1180, W-40, 1260], radius=14, fill='#e74c3c')
d2.text((W//2-60, 1206), '保存', fill='#fff', font_size=38)

save(img2, '02_record.png')

# ====== 3. 统计页 ======
img3 = Image.new('RGB', (W, H), '#f5f5f5')
d3 = ImageDraw.Draw(img3)
d3.rectangle([0, 0, W, 80], fill='#fff')
d3.text((30, 20), '←', fill='#999', font_size=42)
d3.text((W//2-90, 18), '📊 统计', fill='#333', font_size=38)
d3.line([0, 78, W, 78], fill='#f0f0f0', width=2)

# 预设按钮
for i, p in enumerate(['今天','本周','本月','本年','全部']):
    bx = 40 + i * 190
    clr = '#27ae60' if i == 0 else '#f0f0f0'
    tclr = '#fff' if i == 0 else '#666'
    d3.rounded_rectangle([bx, 100, bx+170, 140], radius=16, fill=clr)
    d3.text((bx+50, 106), p, fill=tclr, font_size=26)

# 汇总
d3.rounded_rectangle([40, 160, W-40, 300], radius=20, fill='#fff')
d3.text((80, 178), '支出', fill='#999', font_size=26)
d3.text((80, 215), '¥128.50', fill='#e74c3c', font_size=50)
d3.text((W//2-40, 178), '收入', fill='#999', font_size=26)
d3.text((W//2-40, 215), '¥5,600', fill='#27ae60', font_size=50)
d3.text((W-280, 178), '结余', fill='#999', font_size=26)
d3.text((W-280, 215), '¥5,471.50', fill='#333', font_size=50)

# 趋势图
d3.rounded_rectangle([40, 320, W-40, 720], radius=20, fill='#fff')
d3.text((60, 338), '📈 每日趋势', fill='#333', font_size=34)

# 收入线
pts = [(80,700),(180,680),(300,670),(420,640),(540,630),(660,610),(780,600),(900,580)]
for i in range(len(pts)-1):
    d3.line([pts[i], pts[i+1]], fill='#27ae60', width=3)
for x, y in pts:
    d3.ellipse([x-4, y-4, x+4, y+4], fill='#27ae60')
d3.text((905, 568), '收入', fill='#27ae60', font_size=28)

# 支出线
pts2 = [(80,730),(180,720),(300,710),(420,700),(540,740),(660,730),(780,750),(900,740)]
for i in range(len(pts2)-1):
    d3.line([pts2[i], pts2[i+1]], fill='#e74c3c', width=3)
for x, y in pts2:
    d3.ellipse([x-4, y-4, x+4, y+4], fill='#e74c3c')
d3.text((905, 728), '支出', fill='#e74c3c', font_size=28)

# 收支明细
d3.rounded_rectangle([40, 740, W-40, 980], radius=20, fill='#fff')
d3.text((60, 756), '💸 收支明细', fill='#333', font_size=34)
for i, (icon, cat, amt) in enumerate([('🍜','餐饮','-¥42.00'),('🚗','交通','-¥28.50'),('☕','饮品','-¥18.00')]):
    y = 810 + i * 60
    d3.text((80, y), icon, font_size=36)
    d3.text((150, y+2), cat, fill='#333', font_size=30)
    d3.text((W-200, y+2), amt, fill='#e74c3c', font_size=30)

save(img3, '03_stats.png')

# ====== 4. 设置页 ======
img4 = Image.new('RGB', (W, H), '#f5f5f5')
d4 = ImageDraw.Draw(img4)
d4.rectangle([0, 0, W, 80], fill='#fff')
d4.text((30, 20), '←', fill='#999', font_size=42)
d4.text((W//2-90, 18), '⚙️ 设置', fill='#333', font_size=38)
d4.line([0, 78, W, 78], fill='#f0f0f0', width=2)

items = [('📋','品类管理','自定义收支品类'),('📤','数据导出','导出CSV文件'),
         ('🔔','提醒设置','账单提醒设置'),('ℹ️','关于','快记交易 v1.0.0')]
for i, (icon, title, sub) in enumerate(items):
    y = 100 + i * 100
    d4.rounded_rectangle([40, y, W-40, y+88], radius=16, fill='#fff')
    d4.text((70, y+16), icon, font_size=38)
    d4.text((140, y+12), title, fill='#333', font_size=32)
    d4.text((140, y+54), sub, fill='#999', font_size=24)
    d4.text((W-80, y+24), '>', fill='#ccc', font_size=30)

save(img4, '04_settings.png')

print('\n✅ 4张截图完成')
for f in sorted(os.listdir(OUT)):
    print(f'  {OUT}/{f}')
