import torch
import torch.nn as nn
import torchvision.models as models

def export_to_onnx():
    """Export the trained ResNet50 model to ONNX format"""
    
    # Recreate model architecture
    model = models.resnet50(pretrained=False)
    num_features = model.fc.in_features
    model.fc = nn.Linear(num_features, 4)  # 4 damage classes
    
    # Load trained weights
    model.load_state_dict(torch.load('best_damage_model.pth', map_location='cpu'))
    model.eval()
    
    # Create dummy input
    dummy_input = torch.randn(1, 3, 224, 224)
    
    # Export to ONNX
    torch.onnx.export(
        model,
        dummy_input,
        'damage_model.onnx',
        export_params=True,
        opset_version=11,
        do_constant_folding=True,
        input_names=['input'],
        output_names=['output'],
        dynamic_axes={
            'input': {0: 'batch_size'},
            'output': {0: 'batch_size'}
        }
    )
    
    print("✓ Model exported to damage_model.onnx")
    print("✓ Copy this file to your Next.js project's public/ folder")

if __name__ == '__main__':
    export_to_onnx()
