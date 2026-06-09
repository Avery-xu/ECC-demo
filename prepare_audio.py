import os
import shutil

# Datasets and files
datasets = {
    'LibriTTS_Clean': [
        '260_123286_000034_000002.wav',
        '1089_134686_000009_000004.wav',
        '1284_1181_000003_000002.wav',
        '1580_141084_000009_000003.wav',
        '5639_40744_000000_000000.wav',
        '5683_32865_000010_000001.wav'
    ],
    'LibriTTS_Other': [
        '3005_163389_000015_000008.wav',
        '3528_168669_000085_000000.wav',
        '367_130732_000020_000001.wav',
        '4350_9170_000035_000000.wav',
        '4852_28312_000001_000004.wav',
        '5484_24317_000004_000000.wav'
    ],
    'VCTK': [
        'p361_023_mic1.wav',
        'p364_023_mic1.wav',
        'p374_021_mic1.wav',
        'p376_023_mic1.wav',
        's5_021_mic1.wav',
        's5_023_mic1.wav'
    ],
    'AIShell': [
        'SSB05440038.wav',
        'SSB06710228.wav',
        'SSB07000265.wav',
        'SSB07170156.wav',
        'SSB11100032.wav',
        'SSB18310269.wav'
    ]
}

# Methods mapping format: method_name_for_web: source_dir
methods_libritts = {
    'gt': 'sub_aligned/select_sub/gt',
    'ecc500': 'sub_aligned/select_sub/proposed_0k5',
    'ecc800': 'sub_aligned/select_sub/proposed_0k8',
    'bigcodec1040': 'sub_aligned/BigCodec1040_sub',
    'mimi560': 'sub_aligned/Mimi560_sub',
    'snac980': 'sub_aligned/SNAC980_sub',
    'taae400': 'sub_aligned/TAAE400_sub',
    'taae700': 'sub_aligned/TAAE700_sub'
}

methods_aishell_vctk = {
    'gt': 'aishell_vctk_aligned/gt',
    'ecc500': 'aishell_vctk_aligned/ECC500',
    'ecc800': 'aishell_vctk_aligned/ECC800',
    'bigcodec1040': 'aishell_vctk_aligned/BigCodec1040',
    'mimi560': 'aishell_vctk_aligned/Mimi560',
    'snac980': 'aishell_vctk_aligned/SNAC980',
    'taae400': 'aishell_vctk_aligned/TAAE400',
    'taae700': 'aishell_vctk_aligned/TAAE700'
}

# Remove existing audio directory to clean up old stuff
shutil.rmtree('audio', ignore_errors=True)
os.makedirs('audio', exist_ok=True)

for dataset, wavs in datasets.items():
    dataset_dir = os.path.join('audio', dataset)
    os.makedirs(dataset_dir, exist_ok=True)
    
    for wav_file in wavs:
        # Create a directory for this file
        sample_id = wav_file.split('.')[0]
        sample_dir = os.path.join(dataset_dir, sample_id)
        os.makedirs(sample_dir, exist_ok=True)
        
        methods = methods_libritts if dataset in ['LibriTTS_Clean', 'LibriTTS_Other'] else methods_aishell_vctk
        for method_key, source_dir in methods.items():
            src_path = os.path.join(source_dir, wav_file)
            dst_path = os.path.join(sample_dir, f'{method_key}.wav')
            if os.path.exists(src_path):
                shutil.copy2(src_path, dst_path)
            else:
                print(f"Warning: Missing {src_path}")
