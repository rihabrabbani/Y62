import yt_dlp
import sys
import json
import os

def get_video_info(url):
    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'skip_download': True,
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            return json.dumps({
                'url': url,
                'title': info.get('title'),
                'thumbnail': info.get('thumbnail'),
                'duration': info.get('duration'),
                'author': info.get('uploader'),
                'formats': [
                    {
                        'itag': f.get('format_id'),
                        'quality': f.get('height'),
                        'mimeType': f.get('ext'),
                        'contentLength': f.get('filesize'),
                        'hasVideo': f.get('vcodec') != 'none',
                        'hasAudio': f.get('acodec') != 'none',
                        'container': f.get('ext')
                    }
                    for f in info.get('formats', []) if f.get('filesize') is not None
                ]
            })
    except Exception as e:
        return json.dumps({'error': str(e)})

def download_video(url, output_path, resolution='720', format_type='mp4'):
    is_audio_only = format_type == 'mp3'
    filename = os.path.join(output_path, f"download-{os.path.basename(output_path)}")
    
    try:
        class LoggerOutputs:
            def debug(self, msg):
                if msg.startswith('[download]'):
                    print(msg, file=sys.stderr)
                    
            def info(self, msg):
                print(msg, file=sys.stderr)
                
            def warning(self, msg):
                print(msg, file=sys.stderr)
                
            def error(self, msg):
                print(msg, file=sys.stderr)
        
        if is_audio_only:
            ydl_opts = {
                'format': 'bestaudio/best',
                'outtmpl': filename,
                'quiet': False,
                'logger': LoggerOutputs(),
                'postprocessors': [{
                    'key': 'FFmpegExtractAudio',
                    'preferredcodec': 'mp3',
                    'preferredquality': '192',
                }],
            }
        else:
            ydl_opts = {
                'format': f'bestvideo[height<={resolution}]+bestaudio/best[height<={resolution}]',
                'merge_output_format': 'mp4',
                'outtmpl': filename,
                'quiet': False,
                'logger': LoggerOutputs(),
                'postprocessors': [
                    {
                        'key': 'FFmpegVideoConvertor',
                        'preferedformat': 'mp4',
                    }
                ],
                'postprocessor_args': [
                    '-c:v', 'copy',
                    '-c:a', 'aac',
                    '-b:a', '192k'
                ],
            }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
            
        # Find the actual filename created by yt-dlp
        files = os.listdir(output_path)
        downloaded_file = next((f for f in files if f.startswith(os.path.basename(filename))), None)
        
        if downloaded_file:
            return json.dumps({
                'success': True,
                'file': downloaded_file
            })
        else:
            return json.dumps({
                'error': 'Download completed but file not found'
            })
            
    except Exception as e:
        return json.dumps({'error': str(e)})

if __name__ == "__main__":
    command = sys.argv[1]
    
    if command == "info":
        print(get_video_info(sys.argv[2]))
    elif command == "download":
        url = sys.argv[2]
        output_path = sys.argv[3]
        resolution = sys.argv[4] if len(sys.argv) > 4 else "720"
        format_type = sys.argv[5] if len(sys.argv) > 5 else "mp4"
        print(download_video(url, output_path, resolution, format_type))
    else:
        print(json.dumps({'error': 'Invalid command'}))
