import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Block {
  id: string;
  type: 'hero' | 'text' | 'image' | 'achievements' | 'gallery' | 'video' | 'music';
  content: any;
}

const Snowflake = ({ delay, duration, left }: { delay: number; duration: number; left: string }) => (
  <div
    className="absolute text-white opacity-70 pointer-events-none animate-snow-fall"
    style={{
      left,
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`,
      fontSize: `${Math.random() * 10 + 10}px`,
    }}
  >
    ❄
  </div>
);

export default function Index() {
  const [blocks, setBlocks] = useState<Block[]>([
    {
      id: '1',
      type: 'hero',
      content: {
        title: 'Мои итоги 2025 года',
        subtitle: 'Незабываемый год полный достижений',
      },
    },
    {
      id: '2',
      type: 'achievements',
      content: {
        items: [
          { emoji: '🎯', title: 'Цели достигнуты', count: '12/15' },
          { emoji: '📚', title: 'Книг прочитано', count: '24' },
          { emoji: '✈️', title: 'Стран посещено', count: '5' },
        ],
      },
    },
    {
      id: '3',
      type: 'gallery',
      content: {
        title: 'Лучшие моменты',
        images: [
          'https://images.unsplash.com/photo-1482575832494-771f74bf6857',
          'https://images.unsplash.com/photo-1512389142860-9c449e58a543',
          'https://images.unsplash.com/photo-1513151233558-d860c5398176',
        ],
      },
    },
    {
      id: '4',
      type: 'text',
      content: {
        title: 'Пожелания на новый год',
        text: 'Пусть следующий год будет еще ярче, насыщеннее и успешнее!',
      },
    },
  ]);

  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleFileUpload = (file: File, blockId: string, field: string) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const block = blocks.find(b => b.id === blockId);
      if (block) {
        updateBlock(blockId, { ...block.content, [field]: result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleMultipleFileUpload = (files: FileList, blockId: string) => {
    const imageUrls: string[] = [];
    let loadedCount = 0;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        imageUrls.push(reader.result as string);
        loadedCount++;
        
        if (loadedCount === files.length) {
          const block = blocks.find(b => b.id === blockId);
          if (block && block.type === 'gallery') {
            updateBlock(blockId, { ...block.content, images: [...block.content.images, ...imageUrls] });
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const snowflakes = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    delay: Math.random() * 10,
    duration: Math.random() * 10 + 15,
    left: `${Math.random() * 100}%`,
  }));

  const addBlock = (type: Block['type']) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      content: getDefaultContent(type),
    };
    setBlocks([...blocks, newBlock]);
    toast.success('Блок добавлен');
  };

  const getDefaultContent = (type: Block['type']) => {
    switch (type) {
      case 'hero':
        return { title: 'Заголовок', subtitle: 'Подзаголовок' };
      case 'text':
        return { title: 'Заголовок', text: 'Текст раздела' };
      case 'image':
        return { url: '', caption: '' };
      case 'achievements':
        return { items: [{ emoji: '🎉', title: 'Достижение', count: '10' }] };
      case 'gallery':
        return { title: 'Галерея', images: [] };
      case 'video':
        return { url: '', title: '' };
      case 'music':
        return { url: '', title: 'Музыка' };
      default:
        return {};
    }
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id));
    toast.success('Блок удален');
  };

  const updateBlock = (id: string, content: any) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, content } : b)));
    toast.success('Блок обновлен');
  };

  const renderBlock = (block: Block) => {
    switch (block.type) {
      case 'hero':
        return (
          <div className="relative h-[60vh] md:h-[70vh] flex items-center justify-center bg-gradient-to-br from-primary via-accent to-primary overflow-hidden">
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10 text-center text-white px-4 md:px-6 animate-fade-in">
              <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-3 md:mb-4">{block.content.title}</h1>
              <p className="text-lg md:text-xl lg:text-2xl opacity-90">{block.content.subtitle}</p>
            </div>
          </div>
        );

      case 'achievements':
        return (
          <div className="py-12 md:py-20 px-4 md:px-6 bg-gradient-to-b from-background to-muted">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-12">Мои достижения</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                {block.content.items.map((item: any, idx: number) => (
                  <Card
                    key={idx}
                    className="p-6 md:p-8 text-center hover:shadow-xl transition-all hover:scale-105 animate-scale-in"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="text-5xl md:text-6xl mb-3 md:mb-4">{item.emoji}</div>
                    <h3 className="text-lg md:text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-3xl md:text-4xl font-bold text-primary">{item.count}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 'gallery':
        return (
          <div className="py-12 md:py-20 px-4 md:px-6 bg-background">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-12">{block.content.title}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
                {block.content.images.map((img: string, idx: number) => (
                  <div
                    key={idx}
                    className="aspect-square overflow-hidden rounded-lg hover:scale-105 transition-transform animate-scale-in"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="py-12 md:py-20 px-4 md:px-6 bg-gradient-to-b from-muted to-background">
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">{block.content.title}</h2>
              <p className="text-lg md:text-xl lg:text-2xl leading-relaxed opacity-80">{block.content.text}</p>
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="py-12 md:py-20 px-4 md:px-6 bg-background">
            <div className="max-w-4xl mx-auto animate-fade-in">
              {block.content.url && (
                <img src={block.content.url} alt="" className="w-full rounded-lg shadow-lg" />
              )}
              {block.content.caption && (
                <p className="text-center text-lg md:text-xl mt-4 opacity-80">{block.content.caption}</p>
              )}
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="py-12 md:py-20 px-4 md:px-6 bg-gradient-to-b from-muted to-background">
            <div className="max-w-4xl mx-auto animate-fade-in">
              {block.content.title && (
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">{block.content.title}</h2>
              )}
              {block.content.url && (
                <video src={block.content.url} controls className="w-full rounded-lg shadow-lg" />
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="py-12 md:py-20 px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-muted-foreground">Блок типа {block.type}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {snowflakes.map((snow) => (
        <Snowflake key={snow.id} delay={snow.delay} duration={snow.duration} left={snow.left} />
      ))}

      <div className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b shadow-lg">
        <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
          <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            ✨ <span className="hidden sm:inline">Итоги года</span>
          </h1>

          <div className="flex gap-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Icon name="Plus" className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Добавить блок</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] md:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Выберите тип блока</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {[
                    { type: 'hero' as const, icon: 'Sparkles', label: 'Обложка' },
                    { type: 'text' as const, icon: 'Type', label: 'Текст' },
                    { type: 'image' as const, icon: 'Image', label: 'Изображение' },
                    { type: 'achievements' as const, icon: 'Trophy', label: 'Достижения' },
                    { type: 'gallery' as const, icon: 'Images', label: 'Галерея' },
                    { type: 'video' as const, icon: 'Video', label: 'Видео' },
                    { type: 'music' as const, icon: 'Music', label: 'Музыка' },
                  ].map((item) => (
                    <Button
                      key={item.type}
                      variant="outline"
                      className="h-20 flex-col gap-2"
                      onClick={() => {
                        addBlock(item.type);
                        setIsAddDialogOpen(false);
                      }}
                    >
                      <Icon name={item.icon} className="h-6 w-6" />
                      {item.label}
                    </Button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="default" size="sm">
              <Icon name="Download" className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Экспорт</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-20">
        {blocks.map((block) => (
          <div
            key={block.id}
            className={`relative group ${selectedBlock === block.id ? 'ring-4 ring-primary' : ''}`}
            onClick={() => setSelectedBlock(block.id)}
          >
            {renderBlock(block)}

            <div className="absolute top-2 right-2 md:top-4 md:right-4 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex gap-1 md:gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingBlock(block);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Icon name="Edit" className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto max-w-[95vw] md:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Редактировать блок</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    {block.type === 'hero' && (
                      <>
                        <Input
                          placeholder="Заголовок"
                          defaultValue={block.content.title}
                          onChange={(e) => updateBlock(block.id, { ...block.content, title: e.target.value })}
                        />
                        <Input
                          placeholder="Подзаголовок"
                          defaultValue={block.content.subtitle}
                          onChange={(e) => updateBlock(block.id, { ...block.content, subtitle: e.target.value })}
                        />
                      </>
                    )}
                    {block.type === 'text' && (
                      <>
                        <Input
                          placeholder="Заголовок"
                          defaultValue={block.content.title}
                          onChange={(e) => updateBlock(block.id, { ...block.content, title: e.target.value })}
                        />
                        <Textarea
                          placeholder="Текст"
                          defaultValue={block.content.text}
                          rows={5}
                          onChange={(e) => updateBlock(block.id, { ...block.content, text: e.target.value })}
                        />
                      </>
                    )}
                    {block.type === 'image' && (
                      <>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Загрузить изображение</label>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(file, block.id, 'url');
                            }}
                          />
                        </div>
                        {block.content.url && (
                          <img src={block.content.url} alt="Preview" className="w-full rounded-lg" />
                        )}
                        <Input
                          placeholder="Подпись к изображению"
                          defaultValue={block.content.caption}
                          onChange={(e) => updateBlock(block.id, { ...block.content, caption: e.target.value })}
                        />
                      </>
                    )}
                    {block.type === 'gallery' && (
                      <>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Загрузить фотографии</label>
                          <Input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                              const files = e.target.files;
                              if (files) handleMultipleFileUpload(files, block.id);
                            }}
                          />
                        </div>
                        <Input
                          placeholder="Название галереи"
                          defaultValue={block.content.title}
                          onChange={(e) => updateBlock(block.id, { ...block.content, title: e.target.value })}
                        />
                        {block.content.images.length > 0 && (
                          <div className="grid grid-cols-3 gap-2">
                            {block.content.images.map((img: string, idx: number) => (
                              <div key={idx} className="relative group">
                                <img src={img} alt="" className="w-full aspect-square object-cover rounded" />
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                                  onClick={() => {
                                    const newImages = block.content.images.filter((_: string, i: number) => i !== idx);
                                    updateBlock(block.id, { ...block.content, images: newImages });
                                  }}
                                >
                                  <Icon name="X" className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                    {block.type === 'video' && (
                      <>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Загрузить видео</label>
                          <Input
                            type="file"
                            accept="video/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(file, block.id, 'url');
                            }}
                          />
                        </div>
                        {block.content.url && (
                          <video src={block.content.url} controls className="w-full rounded-lg" />
                        )}
                        <Input
                          placeholder="Название видео"
                          defaultValue={block.content.title}
                          onChange={(e) => updateBlock(block.id, { ...block.content, title: e.target.value })}
                        />
                      </>
                    )}
                    {block.type === 'achievements' && (
                      <div className="space-y-4">
                        {block.content.items.map((item: any, idx: number) => (
                          <Card key={idx} className="p-4 space-y-2">
                            <Input
                              placeholder="Эмодзи"
                              defaultValue={item.emoji}
                              onChange={(e) => {
                                const newItems = [...block.content.items];
                                newItems[idx] = { ...item, emoji: e.target.value };
                                updateBlock(block.id, { ...block.content, items: newItems });
                              }}
                            />
                            <Input
                              placeholder="Название"
                              defaultValue={item.title}
                              onChange={(e) => {
                                const newItems = [...block.content.items];
                                newItems[idx] = { ...item, title: e.target.value };
                                updateBlock(block.id, { ...block.content, items: newItems });
                              }}
                            />
                            <Input
                              placeholder="Значение"
                              defaultValue={item.count}
                              onChange={(e) => {
                                const newItems = [...block.content.items];
                                newItems[idx] = { ...item, count: e.target.value };
                                updateBlock(block.id, { ...block.content, items: newItems });
                              }}
                            />
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                const newItems = block.content.items.filter((_: any, i: number) => i !== idx);
                                updateBlock(block.id, { ...block.content, items: newItems });
                              }}
                            >
                              <Icon name="Trash2" className="h-4 w-4 mr-1" />
                              Удалить
                            </Button>
                          </Card>
                        ))}
                        <Button
                          variant="outline"
                          onClick={() => {
                            const newItems = [...block.content.items, { emoji: '🎉', title: 'Новое достижение', count: '0' }];
                            updateBlock(block.id, { ...block.content, items: newItems });
                          }}
                        >
                          <Icon name="Plus" className="h-4 w-4 mr-1" />
                          Добавить достижение
                        </Button>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                size="sm"
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteBlock(block.id);
                }}
              >
                <Icon name="Trash2" className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {blocks.length === 0 && (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <Icon name="FileText" className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-xl text-muted-foreground mb-4">Начните создавать свои итоги года</p>
            <Button onClick={() => addBlock('hero')}>
              <Icon name="Plus" className="mr-2 h-4 w-4" />
              Добавить первый блок
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}