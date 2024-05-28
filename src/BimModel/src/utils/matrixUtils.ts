import * as THREE from "three";
const matrix = new THREE.Matrix4();
export function getMatrixFromPlaneAndPoint(
  plane: THREE.Plane,
  point: THREE.Vector3
) {
  // Tìm vector pháp tuyến của mặt phẳng
  const normal = plane.normal.clone();
  const d = plane.constant;

  // Tìm một điểm trên mặt phẳng (sử dụng d và pháp tuyến)
  const planePoint = normal.clone().multiplyScalar(-d);

  // Tạo ma trận dịch chuyển để đưa mặt phẳng về mặt phẳng XY
  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(normal, new THREE.Vector3(0, 1, 0));

  const translation = new THREE.Matrix4().makeTranslation(
    planePoint.x,
    planePoint.y,
    planePoint.z
  );
  const rotation = new THREE.Matrix4().makeRotationFromQuaternion(quaternion);

  // Kết hợp dịch chuyển và xoay
  matrix.multiplyMatrices(translation, rotation);

  // Dịch chuyển điểm đến gốc tọa độ
  const pointTranslation = new THREE.Matrix4().makeTranslation(
    -point.x,
    -point.y,
    -point.z
  );
  matrix.multiply(pointTranslation);

  return matrix;
}
