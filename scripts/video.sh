#!/bin/bash
set -euo pipefail

# Configuração
SRC="${SRC:-/Users/reangeline/Projects/Missale/missale-growth/output/2026-09-30/demo-reels}"
DURATION="25.2"
MAX_SIZE=4194304  # 4 MB em bytes
CRF_START=28
CRF_MAX=34

# Função para compactar vídeo com CRF adaptativo
encode_video() {
    local lang=$1
    local output="public/video/hero-${lang}.mp4"
    local input="${SRC}/demo-${lang}.mp4"

    # Verifica se o arquivo de entrada existe
    if [ ! -f "$input" ]; then
        echo "❌ Erro: arquivo de entrada não encontrado: $input"
        return 1
    fi

    echo "📹 Processando vídeo: $lang"

    local crf=$CRF_START
    local file_size=0

    # Loop adaptativo de CRF
    while [ $crf -le $CRF_MAX ]; do
        echo "  Tentando CRF=$crf..."

        # Codifica vídeo
        ffmpeg -y -i "$input" \
            -t "$DURATION" \
            -vf "scale=720:-2,fps=30" \
            -c:v libx264 \
            -crf "$crf" \
            -preset slow \
            -pix_fmt yuv420p \
            -movflags +faststart \
            -an \
            "$output" 2>&1 | grep -E "(Duration|frame=)" | tail -1

        # Checa tamanho do arquivo
        file_size=$(stat -f%z "$output" 2>/dev/null || stat -c%s "$output" 2>/dev/null)

        if [ $file_size -le $MAX_SIZE ]; then
            echo "  ✅ Tamanho OK: $(numfmt --to=iec-i --suffix=B $file_size 2>/dev/null || echo $file_size bytes) (CRF=$crf)"
            break
        else
            size_mb=$(echo "scale=2; $file_size / 1048576" | bc)
            echo "  ⚠️  Tamanho alto: ${size_mb}MB (limite 4MB), aumentando CRF..."
            crf=$((crf + 1))
        fi
    done

    if [ $file_size -gt $MAX_SIZE ]; then
        echo "❌ Erro: não conseguiu comprimir abaixo de 4MB mesmo com CRF=$CRF_MAX"
        return 1
    fi

    # Gera pôster (quadro em 2s)
    local poster="public/video/poster-${lang}.jpg"
    echo "  📸 Gerando pôster..."
    ffmpeg -y -i "$output" \
        -ss 2 \
        -frames:v 1 \
        -q:v 5 \
        "$poster" 2>&1 | grep -E "frame=" | tail -1 || true

    local poster_size=$(stat -f%z "$poster" 2>/dev/null || stat -c%s "$poster" 2>/dev/null)
    size_kb=$(echo "scale=1; $poster_size / 1024" | bc)
    echo "  ✅ Pôster: ${size_kb}KB"

    echo ""
}

# Cria diretórios se não existirem
mkdir -p public/video

# Processa cada idioma
for lang in pt en es; do
    encode_video "$lang" || exit 1
done

echo "✨ Todos os vídeos foram processados com sucesso!"
